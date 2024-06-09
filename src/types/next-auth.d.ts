import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { User as UserType, ClubUser } from "./user";

interface NextAuthUser {
  id?: string | null | undefined;
  clubId?: number | null | undefined;
  name: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  role: string;
  image?: string | null;
}

declare module "next-auth/jwt" {
  export interface JWT {
    user: NextAuthUser | AdapterUser;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: NextAuthUser | AdapterUser;

    // user: UserType & DefaultSession["user"];
  }

  export interface User {
    id?: string | null | undefined;
    clubId?: number | null | undefined;
    name: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    role: string;
    image?: string | null;
  }

  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  export interface Account {}
  /** The OAuth profile returned from your provider */
  export interface Profile {}
}
