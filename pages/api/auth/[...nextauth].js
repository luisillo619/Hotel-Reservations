import NextAuth from "next-auth";
import User from "@/models/User";

import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { dbConnect } from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7200, // sesion activa en el back
  },
  jwt: {
    maxAge: 7200, // cookie activa en el back y front
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        dbConnect();
        const result = await User.findOne({ correo: email });

        if (!result) {
          throw new Error("Usuario no encontrado");
        }

        const checkPassword = await compare(password, result.contraseña);
        if (!checkPassword) {
          throw new Error("correo o contraseña no validos");
        }

        if (result.isAdmin) {
          result.role = "admin";
        }

        return result;
      },
    }),
  ],
  pages: {
    signIn: "/", // redireccion la auth no fue exitosa
  },
  callbacks: {
    // async signIn(user, account, profile) {
    //   if (user.isAdmin) {
    //     return true;
    //   }
    //   return false;
    // }, // sirve para verificar si la auth fue o no exitosa
    async jwt(token, user) {
      if (user?.isAdmin) {
        token.role = "admin";
      }
      return token;
    },
  },
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
