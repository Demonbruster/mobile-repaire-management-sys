import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ENV = {
  GOOGLE_ID: process.env.GOOGLE_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
}

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: ENV.GOOGLE_ID,
      clientSecret: ENV.GOOGLE_SECRET
    }),
  ]
})