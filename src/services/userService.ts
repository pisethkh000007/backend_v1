import { UserModel, UserDocument } from "../database/models/user.models";
import { hashPassword } from "../utils/hash";
import { NotFoundError, ValidationError } from "../utils/errors/customErrors";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female";
}

export async function createUser(userData: UserData): Promise<UserDocument> {
  const hashedPassword = await hashPassword(userData.password);
  const user = new UserModel({ ...userData, password: hashedPassword });
  return user.save();
}

export async function getUserById(userId: string): Promise<UserDocument | null> {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError("Invalid user ID format");
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function updateUser(userId: string, updateData: Partial<UserData>): Promise<UserDocument | null> {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError("Invalid user ID format");
  }
  const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError("Invalid user ID format");
  }
  const user = await UserModel.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return { message: "Delete successfully" };
}
