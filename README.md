# College Appointment System

A web-based platform for managing appointments between students and faculty members. Built with **Node.js**, **Express**, and **MongoDB**.

## Features

- User authentication for students and professors
- Professors can set and manage their available time slots
- Students can view available slots and book appointments
- Professors and students can view and manage their appointments
- Professors can cancel appointments

## Project Structure

```
.
├── app.js
├── server.js
├── package.json
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── profController.js
│   └── studController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── Appointment.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── profRoutes.js
│   └── studRoutes.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <https://github.com/JeetDas5/college-appointment-system>
   cd college-appointment-system
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory (see `.env.example` if available)
   - Add the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     PORT=3000
     JWT_SECRET=your_jwt_secret
     ```
4. **Start the server:**
   ```sh
   npm start
   ```

## API Endpoints


## API Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints & Examples

### Authentication

#### Register
`POST /api/auth/register`

**Sample Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "professor"
}
```
**Sample Response:**
```json
{
  "message": "User registered successfully"
}
```

#### Login
`POST /api/auth/login`

**Sample Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Sample Response:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Professor

#### Set Availability
`POST /api/prof/set-availability` *(Requires Bearer Token)*

**Sample Body:**
```json
{
  "availability": [
    "2025-08-01T10:00:00.000Z",
    "2025-08-01T11:00:00.000Z",
    "2025-08-01T14:00:00.000Z"
  ]
}
```
**Sample Response:**
```json
{
  "message": "Availability of the professor updated successfully",
  "availability": [
    "2025-08-01T10:00:00.000Z",
    "2025-08-01T11:00:00.000Z",
    "2025-08-01T14:00:00.000Z"
  ]
}
```

#### Get Availability
`GET /api/prof/get-availability` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "message": "Availability fetched successfully",
  "availability": [
    { "date": "2025-08-01", "time": "10:00:00" },
    { "date": "2025-08-01", "time": "11:00:00" },
    { "date": "2025-08-01", "time": "14:00:00" }
  ]
}
```

#### Get All Appointments
`GET /api/prof/get-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "message": "Appointments fetched successfully",
  "appointments": [
    {
      "_id": "appointment_id",
      "student": {
        "_id": "student_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "professor": "professor_id",
      "timeSlot": "2025-08-01T10:00:00.000Z",
      "status": "confirmed",
      "createdAt": "2025-07-31T15:30:00.000Z",
      "updatedAt": "2025-07-31T15:30:00.000Z"
    }
  ]
}
```

#### Cancel Appointment
`POST /api/prof/cancel-appointment` *(Requires Bearer Token)*

**Sample Body:**
```json
{
  "appointmentId": "<appointment_id>"
}
```
**Sample Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

#### Get Upcoming Confirmed Appointments
`GET /api/prof/my-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "message": "Appointments fetched successfully",
  "appointments": {
    "appointments": [
      {
        "id": "appointment_id",
        "student": {
          "id": "student_id",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "timeSlot": "2025-08-01T10:00:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

### Student

#### View Available Slots for a Professor
`GET /api/stud/slots/:profId` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "message": "Available slots fetched successfully",
  "professor": {
    "id": "professor_id",
    "name": "Professor P1",
    "email": "professor@example.com"
  },
  "availableSlots": [
    { "date": "2025-08-01", "time": "10:00:00" },
    { "date": "2025-08-01", "time": "11:00:00" },
    { "date": "2025-08-01", "time": "14:00:00" }
  ]
}
```

#### Book an Appointment
`POST /api/stud/book-appointment` *(Requires Bearer Token)*

**Sample Body:**
```json
{
  "profId": "<professor_id>",
  "date": "2025-08-01",
  "time": "10:00:00"
}
```
**Sample Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "appointment_id",
    "student": {
      "id": "student_id",
      "name": "Student Name",
      "email": "student@example.com"
    },
    "professor": {
      "id": "professor_id",
      "name": "Professor Name",
      "email": "professor@example.com"
    },
    "timeSlot": "2025-08-01T10:00:00.000Z"
  }
}
```

#### View Your Appointments
`GET /api/stud/my-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "message": "Appointments fetched successfully",
  "appointments": [
    {
      "_id": "appointment_id",
      "student": {
        "_id": "student_id",
        "name": "Student Name",
        "email": "student@example.com"
      },
      "professor": {
        "_id": "professor_id",
        "name": "Professor Name",
        "email": "professor@example.com"
      },
      "timeSlot": "2025-08-01T10:00:00.000Z",
      "status": "confirmed",
      "createdAt": "2025-07-31T15:30:00.000Z",
      "updatedAt": "2025-07-31T15:30:00.000Z"
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
```

## License

This project is licensed under the ISC License.

---

Made with ❤️ by Jeet Das