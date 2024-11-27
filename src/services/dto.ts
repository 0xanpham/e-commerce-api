import { mixed, object, string, ValidationError } from "yup";
import { Role } from "../models/user";
import { HttpException } from "../exceptions/exception";

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

async function validateSignUpDto(dto: any) {
  try {
    await signUpSchema.validate(dto);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new HttpException(400, error.message);
    } else {
      throw error;
    }
  }
}

async function validateSignInDto(dto: any) {
  try {
    await signInSchema.validate(dto);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new HttpException(400, error.message);
    } else {
      throw error;
    }
  }
}

export { validateSignUpDto, validateSignInDto };
