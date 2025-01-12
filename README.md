# User Registration, Campaign Management, and Invoice Generation System ✨

This repository contains a full-stack application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application simplifies user registration, streamlines campaign management, and automates dynamic invoice generation.

## Features 🔧
- 🔐 Secure user registration and login with Email Services and E-mail verification via OTP.
- 📃 CSV upload for campaigns with inline edit/delete capabilities.
- 💳 Dynamic invoice generation linked to PAN Card Numbers.
- 🔰 Admin tools for reviewing campaigns and uploading invoices.

## Folder Structure 📂
- `backend/`: Server-side code (Node.js, Express.js).
- `frontend/`: Client-side code (React.js).
- `database/`: MongoDB schema and sample data.
- `README.md`: Documentation for setup and usage.

## Getting Started ⚡

### Prerequisites 
- Node.js and npm
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

### Running the Application 🚀
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
2. Start the frontend server:
   ```bash
   cd frontend
   npm start
   ```
3. Ensure MongoDB is running and properly connected.

### File Details
- **backend/**: API routes, models, and middleware for server-side logic.
- **frontend/**: React components, routing, and styling for user interactions.
- **database/**: MongoDB schemas for users, campaigns, and invoices.

## Development Workflow ⏳

### Milestones
1. **Day 1:** Setup project structure and implement user registration.
2. **Day 2-6:** Develop campaign management and invoice generation features.
3. **Day 7:** Final testing and deployment.

### Progress Tracking
- Daily standups ⏰
- Kanban board 🖊️
- Milestone reviews 🔄

## Contribution ❤️
We welcome contributions! Fork the repo and submit pull requests for any improvements or bug fixes.

## License 🔒
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---


Tech Stack 🛠️

Frontend:

⚛️ React.js: For building the user interface, including dynamic dashboards and forms.

🎨 Tailwind CSS: For styling the frontend with modern, utility-first CSS.

Backend:

🟢 Node.js: Server-side runtime for handling API requests.

⚡ Express.js: Backend framework for building RESTful APIs.

Database:

🍃 MongoDB: NoSQL database for storing user, campaign, and invoice data.

Authentication:

🔒 JWT (JSON Web Tokens): For secure user authentication and session management.

File Handling:

📂 Multer: For handling file uploads, specifically CSV files.

Utilities:

🛡️ Bcrypt.js: For password hashing and security.

📊 CSV Parser: To validate and process uploaded CSV files.



.env Setup 🛠️
Ensure to configure the following environment variables before running the application:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_Token=<your_jwt_secret>

MAILTRAP_TOKEN=<your_mailtrap_token>
MAILTRAP_ENDPOINT=<your_mailtrap_endpoint>

CLIENT_URL=http://localhost:5173
```
