import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './authconfig'
import { connectToDB } from './lib/utils'
import { User } from './lib/models'
import bcrypt from 'bcrypt'


const login = async (credentials) => {
  try {

    console.log('credentials',credentials)
    const user={}
    const userLogin = await
    fetch(`${process.env.JIRA_PATH}/auth/1/session`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token'
        },
        body: JSON.stringify({ username: credentials.username, password: credentials.password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.errorMessages) {

          console.log('data',data)
          throw new Error('Incorrect password!')

        } else {

          user.session = data.session
          user.loginInfo = data.loginInfo
          user.username = credentials.username
        }
      })

    const userDetail = await
    fetch(`${process.env.JIRA_PATH}/api/2/user/search?username=${credentials.username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token',
          'Cookie':`JSESSIONID=${user.session.value}`

        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('data2',data)
      
          user.email = data[0].emailAddress
          user.displayName = data[0].displayName
  
          const propertyValues = Object.values(data[0].avatarUrls)
          user.avatarUrls = propertyValues
        
      })
    

    console.log('user in login fetch',user)
    return user
  } catch (err) {
    console.log(err)
    throw new Error('Failed to login!')
  }
}

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials)
          console.log('user await login', user)
          return user
        } catch (err) {
          return null
        }
      }
    })
  ],
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.session = user.session
        token.email = user.email
        token.displayName = user.displayName
        token.avatarUrls = user.avatarUrls
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username
        session.user.session = token.session
        session.user.email = token.email
        session.user.displayName = token.displayName
        session.user.avatarUrls = token.avatarUrls
      }
      return session
    }

  }
})
