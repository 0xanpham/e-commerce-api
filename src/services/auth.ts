import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env";
import bcrypt from "bcrypt";

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

function createToken(username: string, role: string): string {
  const token = jwt.sign({ username, role }, jwtSecret, {
    expiresIn: 60 * 60,
  });
  return token;
}

function verifyToken(token: string) {
  const user = jwt.verify(token, jwtSecret);
  return user;
}

export { createToken, verifyToken, hashPassword, comparePassword };
