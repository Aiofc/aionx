import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialProvider from 'next-auth/providers/credentials';
import { db } from '../db';
import { compare, hash } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialProvider({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        console.log(user);
        const bcryptSaltRounds = Number.isInteger(Number(10)) ? Number(10) : 10;

        function validatePassword(password: string, hashedPassword: string) {
          return compare(password, hashedPassword);
        }
        function hashPassword(password: string) {
          return hash(password, bcryptSaltRounds);
        }

        const hashedPassword = hashPassword(credentials?.password as string);
        const passwordIsValid = await validatePassword(
          credentials?.password as string,
          await hashedPassword
        );

        if (passwordIsValid) {
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: '/', //sigin page
  },
};
