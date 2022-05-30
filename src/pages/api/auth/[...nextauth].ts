import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

// import nodemailer from "nodemailer";
// import sgTransport from "nodemailer-sendgrid-transport";

const emailHost = "smtp.sendgrid.net";
const emailUsername = "apikey"; // <- don't replace "apikey" it's the actual username
const emailPassword = process.env.SENDGRID_API_KEY;

const prisma = new PrismaClient();
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/email
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: `smtp://${emailUsername}:${emailPassword}@${emailHost}:587`,
      from: "noreply@sandspiel.club",
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token }) {
      token.userRole = "player";
      return token;
    },
  },
  debug: true,
});
