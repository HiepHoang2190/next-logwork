"use server";

import { fetchWithCredentials } from "@/app/lib/fetchApi";

export const login = async (credentials) => {
  try {
    const user = {};

    const sessionResponse = await fetchWithCredentials(
      `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/auth/1/session`,
      {
        method: "POST",
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      }
    );
    
    if (sessionResponse === "Unauthorized!") {
      throw new Error("Incorrect password!");
    }

    if (sessionResponse === "fetch failed") {
      throw new Error("Something when wrongs, please try again later!");
    }

    user.session = sessionResponse.session;
    user.loginInfo = sessionResponse.loginInfo;
    user.username = credentials.username;

    const userDetailResponse = await fetchWithCredentials(
      `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/user?username=${credentials.username}`,
      {
        method: "GET",
        headers: {
          Cookie: `JSESSIONID=${user.session.value}`,
        },
      }
    );

    if (
      !userDetailResponse ||
      userDetailResponse.errors ||
      userDetailResponse.length === 0
    ) {
      console.error("Failed to fetch user details:", userDetailResponse);
      throw new Error("Failed to fetch user details.");
    }

    user.email = userDetailResponse.emailAddress;
    user.displayName = userDetailResponse.displayName;
    user.avatarUrls = Object.values(userDetailResponse.avatarUrls);
    return user;
  } catch (err) {
    return { error: err.message };
  }
};
