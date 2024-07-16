# WebSocket Web Application with React and FastAPI

This project is a web application that uses WebSockets for real-time communication between a React frontend and a FastAPI backend.

## Project Structure

```
websocket_webapp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   └── Login.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd websocket_webapp/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

   The backend will be available at `http://localhost:8000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd websocket_webapp/frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

## Usage

1. Open your web browser and go to `http://localhost:3000`.
2. Log in using the provided credentials (username: testuser, password: testpassword).
3. Once logged in, you'll be redirected to the dashboard where you can send and receive real-time messages using WebSockets.

## Features

- User authentication
- Real-time messaging using WebSockets
- React frontend with modular components
- FastAPI backend with CORS and WebSocket support

## Development

- Backend: The FastAPI application is in `backend/app/main.py`. You can modify this file to add new routes or change the WebSocket behavior.
- Frontend: The React components are in the `frontend/src/components` directory. You can modify these files to change the UI or add new features.

## Testing

- Backend: Add your tests to the `backend/tests/` directory.
- Frontend: Run `npm test` in the frontend directory to run the React tests.

## Deployment

For production deployment, you'll need to:

1. Set up a production-ready database instead of the in-memory user store.
2. Use environment variables for sensitive information like secret keys.
3. Set up HTTPS for secure communication.
4. Configure your web server (e.g., Nginx) to serve the React build files and proxy WebSocket connections to the FastAPI server.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.