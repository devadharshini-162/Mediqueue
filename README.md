# MediQueue 🏥

**MediQueue** is a modern Hospital OPD (Outpatient Department) Token Management System designed to streamline patient registration and queue management.

## 🚀 Features

- **Patient Registration**: Patients can easily register and receive a token.
- **Real-time Queue Tracking**: View the current state of the queue and estimated wait times.
- **Admin Dashboard**: Manage tokens, mark patients as called, and reset queues.
- **Mobile Responsive**: Built with Vite + Tailwind CSS for a seamless mobile experience.

## 🛠️ Tech Stack

- **Backend**: Java (Spring Boot 3.x), Spring Data JPA
- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Database**: MariaDB / MySQL
- **Build Tools**: Maven, NPM

## 📂 Project Structure

- `src/main/java`: Spring Boot backend implementation.
- `frontend/`: React application (front-end).
- `src/main/resources/application.properties`: Configuration for database and server.

## ⚙️ Setup Instructions

### Backend (Spring Boot)
1. Ensure Java 21+ and Maven are installed.
2. Update `src/main/resources/application.properties` with your database credentials.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (React)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is open-source.
