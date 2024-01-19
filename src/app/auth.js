import NextAuth from 'next-auth';
import { authConfig } from './authconfig';
import { fetchWithCredentials } from '@/app/lib/fetchApi';
import CredentialsProvider from 'next-auth/providers/credentials';

const login = async (credentials) => {
  try {
    const user = {};
  
    const sessionResponse = await fetchWithCredentials(
      `${process.env.JIRA_API_PATH}/auth/1/session`,
      {
        method: 'POST',
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
      }
    );

    if (sessionResponse.errorMessages) {
      console.error('Incorrect password!');
      throw new Error('Incorrect password!');
    }

    user.session = sessionResponse.session;
    user.loginInfo = sessionResponse.loginInfo;
    user.username = credentials.username;


    const userDetailResponse = await fetchWithCredentials(
      `${process.env.JIRA_API_PATH}/api/2/user/search?username=${credentials.username}`,
      {
        method: 'GET',
        headers: {
          'Cookie': `JSESSIONID=${user.session.value}`,
        },
      }
    );

    if (!userDetailResponse || userDetailResponse.errorMessages || userDetailResponse.length === 0) {
      console.error('User details not found:', userDetailResponse);
      throw new Error('User details not found.');
    }

    const userData = userDetailResponse[0];

    user.email = userData.emailAddress;
    user.displayName = userData.displayName;
    user.avatarUrls = Object.values(userData.avatarUrls);

    return user;

  } catch (err) {
    throw new Error('Failed to login!');
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
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
        session.user.name = token.displayName
        session.user.image = token.avatarUrls
        session.user.username = token.username
        session.user.session = token.session
        session.user.email = token.email
        session.user.displayName = token.displayName
        session.user.avatarUrls = token.avatarUrls
      }
      return session
    }

  }
});
