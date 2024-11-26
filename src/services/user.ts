import { User } from "../models/user";
import logger from "../utils/logger";

async function createUser(username: string, password: string) {
  const user = new User({ username, password });
  const newUser = await user.save();
  logger.info(`User ${username} created successfully`);
  return newUser.toJSON();
}

export { createUser };
