# Real-Time Code Mentor

This project is an online coding web application that allows mentors to share code blocks with students in real-time. It includes a lobby page where users can choose from various code blocks and a code block page where mentors can observe code changes made by students in real-time.

## Deployment

The project is deployed on Render. You can access the deployed static site <a href="https://realtime-code-mentor-1.onrender.com" target="_blank" rel="noopener noreferrer">here</a>.


## Features

- Lobby page with a list of code blocks to choose from.
- Real-time code editing and observation for mentors and students.
- Syntax highlighting for JavaScript code using Highlight.js.
- Firebase Realtime Database integration for real-time data synchronization.

## Technology Stack

### Backend

- Node.js
- Express.js
- Socket.io

### Frontend

- React
- Vite
- Material-UI

### Database

- Firebase Realtime Database

## Getting Started

### Backend

1. Navigate to the `backend` directory: `cd backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file in the `backend` directory and define the following environment variable:
`PORT=5000`. Replace `5000` with the desired port number.
5. Start the backend server: `npm start`.

### Frontend

1. Navigate to the `frontend/my-app` directory: `cd frontend/my-app`.
2. Create a `.env` file in the `frontend/my-app` directory with the following environment variables for Firebase configuration:
- `VITE_REACT_APP_API_KEY=`your_firebase_api_key
- `VITE_REACT_APP_AUTH_DOMAIN=`your_firebase_auth_domain
- `VITE_REACT_APP_PROJECT_ID=`your_firebase_project_id
- `VITE_REACT_APP_STORAGE_BUCKET=`your_firebase_storage_bucket
- `VITE_REACT_APP_MESSAGING_SENDER_ID=`your_firebase_messaging_sender_id
- `VITE_REACT_APP_APP_ID=`your_firebase_app_id
- `VITE_REACT_APP_MEASUREMENT_ID=`your_firebase_measurement_id
- `VITE_REACT_APP_BASE_URL=`http://localhost:5000
* Note: Replace `your_firebase_api_key`, `your_firebase_auth_domain`, `your_firebase_project_id`, `your_firebase_storage_bucket`, `your_firebase_messaging_sender_id`, `your_firebase_app_id`, `your_firebase_measurement_id` with your Firebase project configuration details. Also, ensure that `VITE_REACT_APP_BASE_URL` matches the URL where the backend server is running.
3. Install dependencies: `npm install`.
4. Build the frontend application: `npm run build`.
5. Start the frontend development server: `npm run dev`.

## Usage

- Visit the lobby page and choose a code block.
- Enter the code block page to observe or edit the code in real-time.
- Mentors have read-only access, while students can make code changes.
- Real-time updates are synchronized using Socket.io.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).


