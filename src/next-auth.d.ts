import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
      tel?: string;
      createdAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    tel?: string;
    createdAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    _id?: string;
    role?: string;
    token?: string;
  }
}