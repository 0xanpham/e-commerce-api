import { IUser, Role, User } from "../models/user";
import logger from "../utils/logger";
import { hashPassword } from "./auth";

async function createUser(
  username: string,
  password: string,
  role?: Role
): Promise<IUser> {
  const hashedPassword = await hashPassword(password);
  const user = new User({
    username,
    password: hashedPassword,
    role: role || Role.Buyer,
  });
  const newUser = await user.save();
  logger.info(`User ${username} created successfully`);
  return newUser.toObject();
}

async function findUser(username: string): Promise<IUser> {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User does not exist");
  }
  return user.toObject();
}

export { createUser, findUser };
