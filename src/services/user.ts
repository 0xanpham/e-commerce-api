import { IUser, Role, User } from "../models/user";
import { docToPlainObj } from "../utils/helper";
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
    role: role || Role.Customer,
  });
  const newUser = await user.save();
  logger.info(`User ${username} created successfully`);
  return docToPlainObj(newUser);
}

async function findUser(username: string): Promise<IUser | null> {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }
  return docToPlainObj(user);
}

export { createUser, findUser };
