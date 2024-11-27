import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import bcrypt from "bcrypt";
import { IUser } from "../models/user";
import _ from "lodash";

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

function createToken(user: IUser): string {
  const token = jwt.sign(_.omit(user, ["password"]), jwtSecret, {
    expiresIn: 60 * 60,
  });
  return token;
}

function verifyToken(token: string): IUser {
  const payload = jwt.verify(token, jwtSecret) as JwtPayload;
  const user: IUser = {
    username: payload.username,
    role: payload.role,
  };
  return user;
}

export { createToken, verifyToken, hashPassword, comparePassword };
