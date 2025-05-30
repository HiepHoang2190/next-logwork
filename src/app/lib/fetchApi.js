"use server";

import { processLeaveItem } from "@/app/lib/logWorkAction";
import { Buffer } from 'buffer';
import { cookies } from "next/headers";

export const fetchWithCredentials = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-CSRF-Token, Content-Type",
        ...options.headers,
      },
    });
    if (!response.ok) {
      if ([400, 401, 403].includes(response.status)) throw new Error("Unauthorized!");
      else if ([500, 501, 502, 503].includes(response.status)) throw new Error("fetch failed");
      else throw new Error(`Failed to fetch: ${response}`);
    }
    return response.json();
  } catch (error) {
    return error.message;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("JSESSIONID");
  const headers = {
    ...options.headers,
    Cookie: `JSESSIONID=${token?.value}`,
  };
  return fetchWithCredentials(url, { ...options, headers });
};

export const getCurrentUserData = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("JSESSIONID");
    
    const headers = {
      Cookie: `JSESSIONID=${token?.value}`,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/myself`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const getAvatar = async (url) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("JSESSIONID");
    const headers = {
      Cookie: `JSESSIONID=${token?.value}`,
    };

    const response = await fetch(`${url}`, {
      method: "GET",
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status} ${response.statusText}`);
    }
    
    // Get the response as an ArrayBuffer for binary data
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert Buffer to base64 string
    const base64Data = buffer.toString('base64');
    
    return base64Data;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    throw error;
  }
}

export const getUserIssues = async (username, year, month) => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=(worklogAuthor%20in%20(%22${username}%22))%20AND%20(worklogDate%20%3E%3D%20%27${year}-${month}-01%27%20and%20worklogDate%20%3C%20%27${Number(month) + 1 > 12 ? Number(year) + 1 : year}-${Number(month) + 1 > 12 ? 1 : Number(month) + 1}-01%27)%20ORDER%20BY%20key%20ASC%20&fields=summary%2Cworklog%2Ccreated%2Cupdated%2Cissuetype%2Cparent%2Cproject%2Cstatus%2Cassignee%2Creporter%2Caggregatetimespent%2Ctimeoriginalestimate%2Ctimeestimate&maxResults=1000`;
  return fetchWithAuth(url, { method: "GET" });
};

export const getUserCurrentIssues = async () => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=assignee%3DcurrentUser()%20AND%20resolution%3DUnresolved%20and%20status%20!%3D%20Closed%20ORDER%20BY%20created%20ASC&fields=issuetype%2Csummary%2Creporter%2Cpriority%2Cstatus%2Cresolution%2Ccreated%2Cupdated&maxResults=1000`;
  return fetchWithAuth(url, { method: "GET" });
};

export const getWorklogCurrentIssue = async (issueKey) => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/issue/${issueKey}/worklog?maxResults=5000`;
  return fetchWithAuth(url, { method: "GET" });
};

export const getAllDataUser = async () => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/all-user`;
  return fetchWithAuth(url, { method: "GET" });
};

const getTimeLeaveTotal = async (username) => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/timeleave/${username}`;
  return fetchWithAuth(url, { method: "GET" });
};

const getTimeLeave = async (username) => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/leave/${username}`;
  return fetchWithAuth(url, { method: "GET" });
};

export const fetchDataLeave = async (username) => {
  const [data_time_leave, data_time_leave_total] = await Promise.all([
    getTimeLeave(username),
    getTimeLeaveTotal(username),
  ]);

  const arr_time_leave = data_time_leave
    .map(processLeaveItem)
    .filter((item) => item !== null);

  const arr_time_leave_total = [...data_time_leave_total];

  return { arr_time_leave, arr_time_leave_total };
};
