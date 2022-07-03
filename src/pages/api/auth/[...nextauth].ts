import NextAuth from "next-auth";

import authOptions from "./options";
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authOptions);
