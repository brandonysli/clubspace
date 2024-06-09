import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/utils/prisma";
import type { NextAuthOptions } from "next-auth";
import type { User } from "@/types/user.d";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { decrypt } from "@/utils/encryption";

export const NextOptions: NextAuthOptions = {
  // session: {
  //   strategy: "database",
  // },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      // name: 'Credentials',
      name: "credentials",
      credentials: {
        clubId: { label: "Club ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Credentials not found");
        }

        const { clubId, password } = credentials;

        const club = await prisma.club.findUnique({
          where: {
            id: Number(clubId),
          },
          include: {
            clubMeetings: true,
            credentials: true,
          },
        });

        if (!club || !club.credentials?.password) {
          throw new Error("Club not found");
        }

        // Decrypt the stored password
        const decryptedPassword = decrypt(
          club.credentials.password,
          club.credentials.iv
        ) as string;

        const isPasswordMatch = password === decryptedPassword;

        if (!isPasswordMatch) {
          throw new Error("Invalid password");
        } else {
          await prisma.clubCredential.update({
            where: {
              clubId: Number(clubId),
            },
            data: {
              hasLoggedIn: true,
            },
          });
        }

        return {
          clubId: club.id, // Convert the id to string
          name: club.name,
          image: club.img,
          email: club.email, // This can be removed if not used
          role: "club", // This can be removed if not used
        };
      },
    }),
  ],
  pages: {
    error: "/",
  },

  callbacks: {
    async signIn({ account, user, credentials }) {
      if (account?.provider === "google" && user) {
        return user.email?.endsWith("@cornell.edu") || false;
      } else if (account?.provider === "credentials" && user) {
        return true;
      }

      return false;
    },
    async session({ session, user, token }) {
      if (session?.user && token) {
        // Check if both session.user and user are not undefined
        // session.user = user;
        // if(user){
        //   session.user = token;
        // }
        session.user = token.user;
      } else if (user) {
        session.user = user;
      }
      return session;
    },
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  // A secret should be set in a production environment.
  secret: process.env.SECRET,
};

const handler = NextAuth(NextOptions);

export { handler as GET, handler as POST };
