import { createUser, getUserById, updateUser, deleteUser } from "../../services/userService";
import { UserModel } from "../../database/models/user.models";
import { NotFoundError, ValidationError } from "../../utils/errors/customErrors";
import mongoose from "mongoose";

jest.mock("../../database/models/user.models");

describe("User Service", () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const userData = {
    fullName: "Test User",
    email: "test@example.com",
    password: "Password123!",
    age: 30,
    gender: "male" as const,
  };

  it("should create a new user", async () => {
    UserModel.prototype.save = jest.fn().mockResolvedValue(userData);
    const result = await createUser(userData);
    expect(result).toEqual(userData);
  });

  it("should get a user by ID", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(userData);
    const result = await getUserById(userId);
    expect(result).toEqual(userData);
  });

  it("should throw a validation error for invalid user ID", async () => {
    await expect(getUserById("invalid-id")).rejects.toThrow(ValidationError);
  });

  it("should update a user by ID", async () => {
    const updatedData = { fullName: "Updated Test User" };
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...userData, ...updatedData });
    const result = await updateUser(userId, updatedData);
    expect(result).toEqual({ ...userData, ...updatedData });
  });

  it("should delete a user by ID", async () => {
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(userData);
    const result = await deleteUser(userId);
    expect(result).toEqual({ message: "Delete successfully" });
  });

  it("should throw a not found error when deleting a non-existent user", async () => {
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(deleteUser(userId)).rejects.toThrow(NotFoundError);
  });
});
