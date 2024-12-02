import { array, mixed, number, object, string } from "yup";
import { Role } from "../models/user";

const signUpSchema = object({
  username: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Username must contain alphanumeric characters"
    ),
  password: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Password must contain alphanumeric characters"
    ),
  role: mixed<Role>().oneOf(Object.values(Role), "Invalid role"),
});

const signInSchema = object({
  username: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Username must contain alphanumeric characters"
    ),
  password: string()
    .min(6)
    .max(20)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Password must contain alphanumeric characters"
    ),
});

const productSchema = object({
  name: string()
    .min(6)
    .max(20)
    .matches(/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces")
    .required("Name is required"),
  price: number().min(1).required("Price is required"),
  description: string().max(200),
  images: array(string().url()).max(8),
});

export { signUpSchema, signInSchema, productSchema };
