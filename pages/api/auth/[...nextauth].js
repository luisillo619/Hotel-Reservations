import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
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
          return null;
        }

        const checkPassword = await compare(password, result.contraseña);
        if (!checkPassword) {
          throw new Error("correo o contraseña no validos");
        }

        if (result.isAdmin) {
          result.role = "admin";
        }

        return {
          id: result.id.toString(),
          name: result.nombre,
          email: result.correo,
          role: result.role || "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // si se logea mal en el middleware
  //   signOut: '/auth/signout',
  // error: '/auth/error', // Error code passed in query string as ?error=
  // verifyRequest: '/auth/verify-request', // (used for check email message)
  // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user }) {
      // solo la primera vez que es llamado el objeto user va a ser disponible
      if (user) {
        // esto se puede recuperar desde el middelware
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      // va a ser disponible hasta que el tiempo se acabe
      if (token) {
        session.id = token.id;
        session.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, //session
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
};

export default NextAuth(authOptions);
