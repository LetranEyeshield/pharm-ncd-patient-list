"use server";

import { connectDB } from "../lib/mongodb";
import { User } from "../models/User";

export async function searchUser(username: string, password: string) {
  await connectDB();
  return await User.findOne({ username, password });
}
