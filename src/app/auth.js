import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './authconfig'
import { connectToDB } from './lib/utils'
import { User } from './lib/models'
import bcrypt from 'bcrypt'


const login = async (credentials) => {
  try {
    const user={}
    const userLogin = await
    fetch('https://jira.lotustest.net/rest/auth/1/session',
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
        if (data.session == undefined) {
          throw new Error('Incorrect password!')
        } else {

          user.session = data.session
          user.loginInfo = data.loginInfo
          user.username = credentials.username
        }
      })
    const userDetail = await
    fetch(`https://jira.lotustest.net/rest/api/2/user/search?username=${credentials.username}`,
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

        user.email = data[0].emailAddress
        user.displayName = data[0].displayName

        const propertyValues = Object.values(data[0].avatarUrls)
        user.avatarUrls = propertyValues

      })
    // connectToDB()
    // const user = await User.findOne({ username: credentials.username })

    // if (!user || !user.isAdmin) throw new Error('Not Admin!')

    // const isPasswordCorrect = await bcrypt.compare(
    //   credentials.password,
    //   user.password
    // )

    // if (!isPasswordCorrect) throw new Error('Wrong credentials!')
    // console.log(user)

    // console.log(user)
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
          console.log('use1', user)
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
