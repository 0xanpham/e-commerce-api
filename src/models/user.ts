import mongoose from "mongoose";

export enum Role {
  Admin = "Admin",
  Customer = "Customer",
}

export interface IUser {
  _id?: string;
  username: string;
  password?: string;
  role: string;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export { User };
