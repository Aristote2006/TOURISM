# Tourism App

A web application for managing tourism activities, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Admin dashboard for managing activities
- Activity browsing and filtering
- Responsive design for all screen sizes
- Dark mode support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:8080
```

For this project, use the following MongoDB connection string:
```
MONGODB_URI=mongodb+srv://aristote:aristote@projects.retu688.mongodb.net/TOURISM?retryWrites=true&w=majority&appName=Projects
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Build the frontend:
   ```
   npm run build
   ```
5. Start the server:
   ```
   npm start
   ```

## Development

To run the application in development mode:

1. Start the backend server:
   ```
   npm run server
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run client
   ```

3. Or run both concurrently:
   ```
   npm run dev:full
   ```

## Technologies Used

This project is built with:

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - shadcn-ui
  - Tailwind CSS
  - React Router
  - React Query

- **Backend**:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - JWT Authentication
  - bcrypt for password hashing

## Deployment to Render

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the build settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `MONGODB_URI=mongodb+srv://aristote:aristote@projects.retu688.mongodb.net/TOURISM?retryWrites=true&w=majority&appName=Projects`
     - `JWT_SECRET=your-secure-jwt-secret`
     - `PORT=10000` (or any port Render assigns)
     - `CLIENT_URL=https://your-render-app-url.onrender.com`

## License

This project is licensed under the MIT License.
