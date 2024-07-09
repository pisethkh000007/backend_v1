import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../../services/userService";
import {
  NotFoundError,
  ValidationError,
} from "../../utils/errors/customErrors";

describe("User Service - Integration", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  const generateUserData = (email: string) => ({
    fullName: "Test User",
    email,
    password: "Password123!",
    age: 30,
    gender: "male" as const,
  });

  it("should create a new user", async () => {
    const user = await createUser(generateUserData("test1@example.com"));
    expect(user.fullName).toBe("Test User");
    expect(user.email).toBe("test1@example.com");
  });

  it("should get a user by ID", async () => {
    const user = await createUser(generateUserData("test2@example.com"));
    const foundUser = await getUserById(user.id);
    expect(foundUser).not.toBeNull();
    if (foundUser) {
      expect(foundUser.email).toBe("test2@example.com");
    }
  });

  it("should throw a validation error for invalid user ID", async () => {
    await expect(getUserById("invalid-id")).rejects.toThrow(ValidationError);
  });

  it("should update a user by ID", async () => {
    const user = await createUser(generateUserData("test3@example.com"));
    const updatedData = { fullName: "Updated Test User" };
    const updatedUser = await updateUser(user.id, updatedData);
    expect(updatedUser?.fullName).toBe("Updated Test User");
  });

  it("should delete a user by ID", async () => {
    const user = await createUser(generateUserData("test4@example.com"));
    const response = await deleteUser(user.id);
    expect(response.message).toBe("Delete successfully");
  });

  it("should throw a not found error when deleting a non-existent user", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId().toHexString();
    await expect(deleteUser(nonExistentUserId)).rejects.toThrow(NotFoundError);
  });
});
