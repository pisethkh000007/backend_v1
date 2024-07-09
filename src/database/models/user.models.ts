import { Schema, model, Document } from "mongoose";
import validator from "validator";

export interface User {
  fullName: string;
  email: string;
  password: string;
  status?: string;
  role: string;
  age?: number; // Add age to User interface
  gender?: "male" | "female"; // Add gender to User interface
}

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: (props: { value: string }) =>
        `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isStrongPassword(value),
      message: (_props: { value: string }) => "Password is not strong enough!",
    },
  },
  status: { type: String, default: "active" },
  role: { type: String, required: true, default: "user" },
  age: { type: Number }, // Add age to schema
  gender: { type: String, enum: ["male", "female"] }, // Add gender to schema
});

export const UserModel = model<UserDocument>("User", UserSchema);
