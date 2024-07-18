import asyncio
import os
from datetime import datetime, timedelta
import secrets
from fastapi import FastAPI, WebSocket,WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from typing import Dict, Optional
from passlib.context import CryptContext
from jose import JWTError, jwt

from typing import Dict

app = FastAPI(debug=True)

# File to store messages
MESSAGES_FILE = "messages.json"

# JWT settings
SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


def load_messages():
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'r') as f:
            return json.load(f)
    return []


def save_messages(messages):
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f)


messages = load_messages()
# Dictionary to store connected WebSocket clients
connected_users: Dict[str, WebSocket] = {}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple user store
users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": pwd_context.hash("testpassword"),
    }
}


class User(BaseModel):
    username: str
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return User(**user_dict)


def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "username": user.username}



@app.get("/verify_token")
async def verify_token(current_user: User = Depends(get_current_user)):
    return {"valid": True, "username": current_user.username}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    user = None
    try:
        while True:
            data = await websocket.receive_json()
            if 'token' in data and user is None:
                token = data['token']
                try:
                    user = await get_current_user(token)
                    if user:
                        connected_users[user.username] = websocket
                        await websocket.send_json({"type": "auth_success", "message": "Authentication successful"})
                        await websocket.send_json({"type": "history", "messages": messages})
                        print(f"User {user.username} connected")
                    else:
                        await websocket.send_json({"type": "error", "message": "Invalid token"})
                        break  # Exit the loop instead of closing the connection
                except Exception as e:
                    await websocket.send_json({"type": "error", "message": "Authentication failed"})
                    break  # Exit the loop instead of closing the connection
            elif user and 'message' in data:
                new_message = f"{user.username}: {data['message']}"
                messages.append(new_message)
                save_messages(messages)
                for connection in connected_users.values():
                    await connection.send_json({"type": "new_message", "message": new_message})
            else:
                await websocket.send_json({"type": "error", "message": "Not authenticated or invalid message format"})
    except WebSocketDisconnect:
        pass  # Client disconnected, no need to close the connection
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if user and user.username in connected_users:
            del connected_users[user.username]
            print(f"User {user.username} disconnected")


@app.post("/clear_messages")
async def clear_messages(current_user: User = Depends(get_current_user)):
    global messages
    messages = []
    save_messages(messages)
    return {"message": "All messages cleared"}


@app.get("/users")
async def get_connected_users():
    return {"connected_users": list(connected_users.keys())}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
