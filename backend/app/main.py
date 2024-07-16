import asyncio
import os

from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from typing import Dict

app = FastAPI(debug=True)

# File to store messages
MESSAGES_FILE = "messages.json"


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
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple user store
users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": "fakehashedsecret",
    }
}


class User(BaseModel):
    username: str
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def fake_hash_password(password: str):
    return "fakehashed" + password


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return User(**user_dict)


def fake_decode_token(token):
    # In a real application, you would decode and verify the token here
    user = get_user(users_db, token)
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = User(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}


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
                    user = fake_decode_token(token)
                    if user:
                        connected_users[user.username] = websocket
                        await websocket.send_json({"type": "auth_success", "message": "Authentication successful"})
                        # Send message history separately
                        await websocket.send_json({"type": "history", "messages": messages})
                        print(f"User {user.username} connected")
                    else:
                        await websocket.send_json({"type": "error", "message": "Invalid token"})
                        await websocket.close()
                        return
                except Exception as e:
                    await websocket.send_json({"type": "error", "message": "Authentication failed"})
                    await websocket.close()
                    return
            elif user and 'message' in data:
                new_message = f"{user.username}: {data['message']}"
                messages.append(new_message)
                save_messages(messages)
                # Broadcast message to all connected users
                for connection in connected_users.values():
                    await connection.send_json({"type": "new_message", "message": new_message})
            else:
                await websocket.send_json({"type": "error", "message": "Not authenticated or invalid message format"})
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if user and user.username in connected_users:
            del connected_users[user.username]
            print(f"User {user.username} disconnected")
        await websocket.close()


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
