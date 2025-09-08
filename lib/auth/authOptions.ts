import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/db/mongodb"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('🔐 Auth attempt for:', credentials?.email)
        
        if (!credentials?.email || !credentials.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("bam_portfolio")

          const user = await db.collection("users").findOne({
            email: credentials.email.toLowerCase(),
          })

          console.log('👤 User found:', user ? 'Yes' : 'No')

          if (!user || user.role !== 'admin') {
            console.log('❌ User not found or not admin')
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          console.log('🔑 Password correct:', isPasswordCorrect)

          if (!isPasswordCorrect) {
            console.log('❌ Wrong password')
            return null
          }

          const userObject = {
            id: user._id.toString(),
            name: user.name || user.email,
            email: user.email,
            role: user.role,
          }

          console.log('✅ Returning user object:', userObject)
          return userObject

        } catch (error) {
          console.error('💥 Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('🎫 JWT callback - token:', !!token, 'user:', !!user)
      
      if (user) {
        console.log('🎫 Adding user to token:', user)
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }
      
      console.log('🎫 Final token:', { 
        id: token.id, 
        role: token.role, 
        email: token.email 
      })
      
      return token
    },
    async session({ session, token }) {
      console.log('📱 Session callback - session:', !!session, 'token:', !!token)
      
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      
      console.log('📱 Final session user:', {
        id: session.user?.id,
        role: session.user?.role,
        email: session.user?.email
      })
      
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}