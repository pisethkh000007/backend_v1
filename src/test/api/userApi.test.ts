// import request from "supertest";
// import mongoose from "mongoose";
// import app from "../../app";

// describe("User API", () => {
//   let userId: string;
//   const uniqueEmail = `testuser_${Date.now()}@example.com`; // Ensure unique email

//   beforeAll(async () => {
//     const mongoUri = process.env.MONGODB_URL;
//     if (!mongoUri) {
//       throw new Error("MONGODB_URL environment variable is not defined");
//     }
//     await mongoose.connect(mongoUri);
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   it("should register a new user", async () => {
//     const response = await request(app).post("/api/v1/users/register").send({
//       username: "testuser",
//       email: uniqueEmail,
//       password: "StrongPassword123!",
//       fullName: "Test User",
//       age: 25,
//       gender: "male",
//     });

//     expect(response.status).toBe(201); // Ensure the status code is 201
//     expect(response.body.data).toHaveProperty("_id");
//     userId = response.body.data._id; // Set the user ID for later use
//   }, 10000);

//   it("should get all users", async () => {
//     const response = await request(app).get("/api/v1/users");

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("users");
//   }, 10000);

//   it("should get a user by id", async () => {
//     const response = await request(app).get(`/api/v1/users/${userId}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("_id", userId);
//   }, 10000);

//   it("should update a user by id", async () => {
//     const response = await request(app)
//       .put(`/api/v1/users/${userId}`)
//       .send({ fullName: "Updated Test User" });

//     expect(response.status).toBe(200);
//     expect(response.body.data).toHaveProperty("fullName", "Updated Test User");
//   }, 10000);

//   it("should delete a user by id", async () => {
//     const response = await request(app).delete(`/api/v1/users/${userId}`);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("Delete successfully");
//   }, 10000);
// });

import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";

describe("User API", () => {
  let userId: string;
  const uniqueEmail = `testuser_${Date.now()}@example.com`; // Ensure unique email

  beforeAll(async () => {
    console.log("MONGODB_URL from env:", process.env.MONGODB_URL); // Debug statement
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    await mongoose.connect(mongoUri);
  }, 60000); // Set timeout to 60 seconds

  afterAll(async () => {
    await mongoose.connection.close();
  }, 60000);

  it("should register a new user", async () => {
    const response = await request(app).post("/api/v1/users/register").send({
      username: "testuser",
      email: uniqueEmail,
      password: "StrongPassword123!",
      fullName: "Test User",
      age: 25,
      gender: "male",
    });

    expect(response.status).toBe(201); // Ensure the status code is 201
    expect(response.body.data).toHaveProperty("_id");
    userId = response.body.data._id; // Set the user ID for later use
  }, 60000); // Set timeout to 60 seconds

  it("should get all users", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
  }, 60000);

  it("should get a user by id", async () => {
    const response = await request(app).get(`/api/v1/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
  }, 60000);

  it("should update a user by id", async () => {
    const response = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ fullName: "Updated Test User" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("fullName", "Updated Test User");
  }, 60000);

  it("should delete a user by id", async () => {
    const response = await request(app).delete(`/api/v1/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Delete successfully");
  }, 60000);
});
