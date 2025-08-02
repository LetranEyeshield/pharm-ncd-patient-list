// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ username: credentials?.username });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          //email: user.email || "", // optional
          //role: user.role || "user", // optional
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first login, attach user data to token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        //token.email = user.email;
        //token.role = user.role;
      }
      return token;
    },
    // async session({ session, token }) {
    //   if (!session?.user) {
    //     redirect("/login");
    //   }
    //   //session.user.id = token.id as string;
    //   //session.user.role = token.role as string;
    //   return session;
    // },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        // session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
