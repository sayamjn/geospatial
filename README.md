Geospatial Web Application

This project is a full-stack geospatial web application that allows users to visualize, create, and manage geospatial data. It consists of a Next.js frontend for the user interface and a Go backend for handling data processing and storage.

Project Structure
geospatial/
├── geospatial-frontend/   # Next.js frontend application
└── geospatial-backend/    # Go backend application

Features

User authentication (login/register)
Upload and visualize GeoJSON and KML files
Interactive map for creating and editing geospatial shapes
RESTful API for managing geospatial data
PostgreSQL database for data persistence

Tech Stack

Frontend

Next.js
React
Leaflet for map visualization
Tailwind CSS for styling

Backend

Go
Gin web framework
PostgreSQL database

Getting Started

Important: Makefile Configuration

Before running the project, you need to edit the Makefile in the geospatial-backend directory. Open the Makefile and set the DB_USER variable to your username:
makefileCopyDB_USER := sayamjain

This step is crucial for the correct setup of your database connection.

Prerequisites

Node.js (v14 or later)
Go (v1.16 or later)
PostgreSQL

Setting up the Backend

Navigate to the backend directory:
cd geospatial-backend

Install dependencies:
go mod tidy

Set up your PostgreSQL database and update the connection string in the environment variables.


Run the backend:

go run cmd/server/main.go


The backend will start on http://localhost:8080.

Setting up the Frontend

Navigate to the frontend directory:

cd geospatial-frontend

Install dependencies:

npm install

Create a .env.local file and add the backend URL:

NEXT_PUBLIC_API_URL=http://localhost:8080/api

Run the frontend:
npm run dev


The frontend will start on http://localhost:3000.

For detailed deployment instructions, please refer to the deployment guides in the respective frontend and backend directories.
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
