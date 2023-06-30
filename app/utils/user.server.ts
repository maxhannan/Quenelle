import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import { colorVariants } from "./staticLists";

export interface UserObj {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export const createUser = async (user: UserObj) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      chef: false,
      colorVariant: Math.floor(Math.random() * (colorVariants.length - 1)),
    },
  });
  return { id: newUser.id, username: user.username };
};
