# Gym Fight - Setup and Run Instructions

This guide will help you get the Gym Fight application running on your local machine. Please follow these steps carefully.

## 1. Prerequisites (Software to Install)

Before you begin, you need to have a few software tools installed. If you don't have them, please install them first:

*   **Node.js (which includes npm):** This is used to run JavaScript code for both the backend and frontend.
    *   **Download:** [https://nodejs.org/](https://nodejs.org/) (Download the LTS version, which is recommended for most users).
    *   **Verify installation:** Open a terminal or command prompt and type `node -v` and `npm -v`. You should see version numbers if it's installed correctly.
*   **MongoDB:** This is the database used by the application.
    *   **Download:** [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) (Download MongoDB Community Server).
    *   **Installation Guides:** Follow the installation guide for your specific operating system on the MongoDB website.
    *   **Ensure it's running:** After installation, make sure the MongoDB service is started and running. Usually, it runs on its default port 27017.
*   **A Code Editor (Optional, but Recommended):** To view or make changes to the files.
    *   **Recommendation:** [Visual Studio Code (VS Code)](https://code.visualstudio.com/download) is a popular, free option.

## 2. Setting Up and Running the Backend

The backend is the server-side part of the application.

1.  **Open your Terminal or Command Prompt.**
2.  **Navigate to the backend directory:**
    *   In your terminal, type `cd path/to/your/project/GYMFIGHT/backend`
    *   (Replace `path/to/your/project/` with the actual path where you've saved the GYMFIGHT project).
3.  **Install backend dependencies:**
    *   Once you are in the `GYMFIGHT/backend` directory, type the following command and press Enter:
        ```bash
        npm install
        ```
    *   This will download and install all the necessary software packages for the backend. Wait for it to complete. You might see some warnings, which are usually okay.
4.  **Start the backend server:**
    *   After `npm install` is finished, type the following command and press Enter:
        ```bash
        npm start
        ```
    *   You should see a message like `Backend server running on port 5001` (or similar). This means the backend is running!
    *   You can also open your web browser and go to `http://localhost:5001/` (or whatever port is shown). You should see a message like "Gym Fight Backend API is running...".
    *   **Keep this terminal window open.** If you close it, the backend server will stop.

## 3. Setting Up and Running the Frontend

The frontend is the visual part of the application that you interact with in your web browser.

1.  **Open a NEW Terminal or Command Prompt window.** (Keep the backend terminal window open and running).
2.  **Navigate to the frontend directory:**
    *   In this new terminal, type `cd path/to/your/project/GYMFIGHT/frontend`
    *   (Replace `path/to/your/project/` with the actual path).
3.  **Install frontend dependencies:**
    *   Once you are in the `GYMFIGHT/frontend` directory, type the following command and press Enter:
        ```bash
        npm install
        ```
    *   This will download and install all the necessary software packages for the frontend (like React). Wait for it to complete.
4.  **Start the frontend application:**
    *   After `npm install` is finished, type the following command and press Enter:
        ```bash
        npm start
        ```
    *   This will usually automatically open a new tab in your web browser pointing to `http://localhost:3000/`. If it doesn't, open your browser and go to that address manually.
    *   You should see the Gym Fight application interface.
    *   **Keep this terminal window open.** If you close it, the frontend development server will stop.

## 4. Using the Application

*   Once both the backend and frontend are running, you should be able to use the application by interacting with the page in your browser (which opened at `http://localhost:3000/`).
*   It will make requests to your local backend server.

## Basic Troubleshooting

*   **MongoDB not running:** If the backend fails to start with errors related to "Mongo" or "connection refused," make sure your MongoDB server is installed correctly and is running.
*   **Port conflicts:**
    *   If the backend (`5001`) or frontend (`3000`) ports are already in use by another application, you might get an error. The error message usually tells you this.
    *   For the backend, you can change the port by creating a file named `.env` in the `GYMFIGHT/backend/` directory and adding a line like `PORT=5002`, then restarting the backend.
    *   For the frontend (if `npm start` asks if you want to run on another port), you can usually say "yes."
*   **Typos in commands:** Double-check that you've typed the `cd`, `npm install`, and `npm start` commands exactly as shown.
*   **Firewall:** In some rare cases, your firewall might block Node.js. If you suspect this, you might need to allow Node.js through your firewall.

That's it! You should now have the Gym Fight application running locally.
