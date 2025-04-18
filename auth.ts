import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import User from "./database/user.model";
import dbConnect from "./lib/mongoose";
import { SignInFormSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInFormSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        dbConnect();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "owner" | "user";

      return session;
    },
  },
});
