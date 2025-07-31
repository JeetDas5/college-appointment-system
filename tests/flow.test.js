const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcryptjs");

describe("E2E Appointment Flow", () => {
  let studentA1Token, studentA2Token, professorP1Token;
  let studentA1Id, professorP1Id;
  let appointmentA1Id;

  beforeEach(async () => {
    await User.deleteMany({});
    await Appointment.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    const studentA1 = await User.create({
      name: "Student A1",
      email: "studenta1@test.com",
      password: hashedPassword,
      role: "student",
    });

    const studentA2 = await User.create({
      name: "Student A2",
      email: "studenta2@test.com",
      password: hashedPassword,
      role: "student",
    });

    const professorP1 = await User.create({
      name: "Professor P1",
      email: "professorp1@test.com",
      password: hashedPassword,
      role: "professor",
    });

    studentA1Id = studentA1._id;
    professorP1Id = professorP1._id;
  });

  test("Complete appointment booking and cancellation flow", async () => {
    const studentA1Login = await request(app).post("/api/auth/login").send({
      email: "studenta1@test.com",
      password: "password123",
    });

    expect(studentA1Login.status).toBe(200);
    expect(studentA1Login.body.token).toBeDefined();
    studentA1Token = studentA1Login.body.token;

    const professorP1Login = await request(app).post("/api/auth/login").send({
      email: "professorp1@test.com",
      password: "password123",
    });

    expect(professorP1Login.status).toBe(200);
    expect(professorP1Login.body.token).toBeDefined();
    professorP1Token = professorP1Login.body.token;

    const setAvailability = await request(app)
      .post("/api/prof/set-availability")
      .set("Authorization", `Bearer ${professorP1Token}`)
      .send({
        availability: [
          new Date("2025-08-01T10:00:00.000Z"),
          new Date("2025-08-01T11:00:00.000Z"),
          new Date("2025-08-01T14:00:00.000Z"),
        ],
      });



    expect(setAvailability.status).toBe(200);
    expect(setAvailability.body.message).toBe(
      "Availability set successfully"
    );

    const viewSlots = await request(app)
      .get(`/api/stud/slots/${professorP1Id}`)
      .set("Authorization", `Bearer ${studentA1Token}`);



    expect(viewSlots.status).toBe(200);
    expect(viewSlots.body.availableSlots).toBeDefined();
    expect(viewSlots.body.availableSlots.length).toBeGreaterThan(0);

    const firstSlot = viewSlots.body.availableSlots[0];

    const bookAppointmentA1 = await request(app)
      .post("/api/stud/book-appointment")
      .set("Authorization", `Bearer ${studentA1Token}`)
      .send({
        profId: professorP1Id,
        date: firstSlot.date,
        time: firstSlot.time,
      });



    expect(bookAppointmentA1.status).toBe(201);
    expect(bookAppointmentA1.body.message).toBe(
      "Appointment booked successfully"
    );

    const studentA2Login = await request(app).post("/api/auth/login").send({
      email: "studenta2@test.com",
      password: "password123",
    });

    expect(studentA2Login.status).toBe(200);
    expect(studentA2Login.body.token).toBeDefined();
    studentA2Token = studentA2Login.body.token;

    const viewSlotsAgain = await request(app)
      .get(`/api/stud/slots/${professorP1Id}`)
      .set("Authorization", `Bearer ${studentA2Token}`);

    const secondSlot = viewSlotsAgain.body.availableSlots[0];

    const bookAppointmentA2 = await request(app)
      .post("/api/stud/book-appointment")
      .set("Authorization", `Bearer ${studentA2Token}`)
      .send({
        profId: professorP1Id,
        date: secondSlot.date,
        time: secondSlot.time,
      });



    expect(bookAppointmentA2.status).toBe(201);
    expect(bookAppointmentA2.body.message).toBe(
      "Appointment booked successfully"
    );

    const appointments = await Appointment.find({
      professor: professorP1Id,
      status: "confirmed",
    });
    expect(appointments.length).toBe(2);

    const studentA1Appointment = await Appointment.findOne({
      student: studentA1Id,
      professor: professorP1Id,
      status: "confirmed",
    });
    expect(studentA1Appointment).toBeTruthy();
    appointmentA1Id = studentA1Appointment._id;

    const cancelAppointment = await request(app)
      .post("/api/prof/cancel-appointment")
      .set("Authorization", `Bearer ${professorP1Token}`)
      .send({
        appointmentId: appointmentA1Id,
      });

    expect(cancelAppointment.status).toBe(200);
    expect(cancelAppointment.body.message).toBe(
      "Appointment cancelled successfully"
    );

    const checkA1Appointments = await request(app)
      .get("/api/stud/my-appointments")
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(checkA1Appointments.status).toBe(200);
    expect(checkA1Appointments.body.appointments).toBeDefined();

    const confirmedAppointments = checkA1Appointments.body.appointments.filter(
      (apt) => apt.status === "confirmed"
    );
    expect(confirmedAppointments.length).toBe(0);

    const checkA2Appointments = await request(app)
      .get("/api/stud/my-appointments")
      .set("Authorization", `Bearer ${studentA2Token}`);

    expect(checkA2Appointments.status).toBe(200);
    const confirmedA2Appointments =
      checkA2Appointments.body.appointments.filter(
        (apt) => apt.status === "confirmed"
      );
    expect(confirmedA2Appointments.length).toBe(1);

    const cancelledAppointment = await Appointment.findById(appointmentA1Id);
    expect(cancelledAppointment.status).toBe("cancelled");
  });
});
