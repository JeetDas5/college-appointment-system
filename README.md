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
  "slots": [
    { "date": "2025-08-01", "start": "10:00", "end": "11:00" },
    { "date": "2025-08-01", "start": "11:00", "end": "12:00" }
  ]
}
```
**Sample Response:**
```json
{
  "message": "Availability set successfully"
}
```

#### Get Availability
`GET /api/prof/get-availability` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "availability": [
    { "date": "2025-08-01", "start": "10:00", "end": "11:00" }
  ]
}
```

#### Get All Appointments
`GET /api/prof/get-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "appointments": [
    {
      "student": "Jane Smith",
      "date": "2025-08-01",
      "start": "10:00",
      "end": "11:00",
      "status": "confirmed"
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
  "message": "Appointment cancelled"
}
```

#### Get Upcoming Confirmed Appointments
`GET /api/prof/my-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "appointments": [
    {
      "student": "Jane Smith",
      "date": "2025-08-01",
      "start": "10:00",
      "end": "11:00",
      "status": "confirmed"
    }
  ]
}
```

### Student

#### View Available Slots for a Professor
`GET /api/stud/slots/:profId` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "slots": [
    { "date": "2025-08-01", "start": "10:00", "end": "11:00" }
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
  "start": "10:00",
  "end": "11:00"
}
```
**Sample Response:**
```json
{
  "message": "Appointment booked successfully"
}
```

#### View Your Appointments
`GET /api/stud/my-appointments` *(Requires Bearer Token)*

**Sample Response:**
```json
{
  "appointments": [
    {
      "professor": "Dr. Smith",
      "date": "2025-08-01",
      "start": "10:00",
      "end": "11:00",
      "status": "confirmed"
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