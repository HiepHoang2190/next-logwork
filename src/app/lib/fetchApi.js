'use server';

import axios from 'axios';
import { processLeaveItem } from "@/app/lib/logWorkAction";
import { cookies } from "next/headers";

const BE_BASE_URL = process.env.NEXT_PUBLIC_APP_API_PATH
// ---------------------------------------------------------------------------
// Axios instance factory
// ---------------------------------------------------------------------------

const createAxiosWithToken = (token) => {
  const instance = axios.create({
    baseURL: BE_BASE_URL,
    headers: {
      Accept: 'application/json, text/plain, */*',
      Cookie: `JSESSIONID=${token}`,
    },
  });

  instance.interceptors.request.use((config) => {
    console.debug(`[fetchApi] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
    });
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.debug(`[fetchApi] ← ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const url    = error.config?.url;

      if ([400, 401, 403].includes(status)) {
        console.error(`[fetchApi] Unauthorized (${status}): ${url}`);
        return Promise.reject(new Error('Unauthorized!'));
      }
      if ([500, 501, 502, 503].includes(status)) {
        console.error(`[fetchApi] Server error (${status}): ${url}`);
        return Promise.reject(new Error('fetch failed'));
      }
      console.error(`[fetchApi] Request failed: ${url}`, error.message);
      return Promise.reject(error);
    },
  );

  return instance;
};

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

export const fetchWithCredentials = async (url, options = {}) => {
  try {
    const { method = 'GET', headers = {}, data } = options;

    const response = await axios({
      url,
      method,
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...(method.toUpperCase() !== 'GET' && { 'Content-Type': 'application/json' }),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, Content-Type',
        ...headers,
      },
      data,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if ([400, 401, 403].includes(status)) return 'Unauthorized!';
      if ([500, 501, 502, 503].includes(status)) return 'fetch failed';
    }
    return error.message;
  }
};

const getAuthInstance = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('JSESSIONID');
  return createAxiosWithToken(token?.value ?? '');
};

export const fetchWithAuth = async (url, options = {}) => {
  const { method = 'GET', data, params } = options;
  const api = getAuthInstance();
  const response = await api({
    url,
    method,
    data,
    params,
    // Only declare a JSON body when there is actually one to send.
    // Sending Content-Type: application/json with no body causes Jira to
    // return "No content to map to Object due to end of input".
    headers: method.toUpperCase() !== 'GET' ? { 'Content-Type': 'application/json' } : {},
  });
  return response.data;
};

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export const getCurrentUserData = async () => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/myself`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getAvatar = async (url) => {
  try {
    const api = getAuthInstance();
    const response = await api({
      url,
      method: 'GET',
      responseType: 'arraybuffer',  // binary response — not JSON
    });

    return Buffer.from(response.data).toString('base64');
  } catch (error) {
    console.error('Error fetching avatar:', error);
    throw error;
  }
};

export const getUserIssues = async (username, year, month) => {
  const nextMonth = month + 1 > 12 ? 1 : month + 1;
  const nextYear = month + 1 > 12 ? year + 1 : year;

  const jql = encodeURIComponent(`
    worklogAuthor in ("${username}")
    AND worklogDate >= "${year}-${String(month).padStart(2, "0")}-01"
    AND worklogDate < "${nextYear}-${String(nextMonth).padStart(2, "0")}-01"
    ORDER BY key ASC
  `);

  const fields = [
    "summary",
    "worklog",
    "created",
    "updated",
    "issuetype",
    "parent",
    "project",
    "status",
    "assignee",
    "reporter",
    "aggregatetimespent",
    "timeoriginalestimate",
    "timeestimate",
  ].join(",");

  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=${jql}&fields=${fields}&maxResults=1000`;

  return fetchWithAuth(url, { method: "GET" });
};

export const getUserCurrentIssues = async () => {
  const jql = encodeURIComponent(
    "assignee = currentUser() AND resolution = Unresolved AND status != Closed ORDER BY created ASC"
  );
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=${jql}&fields=issuetype,summary,reporter,priority,status,resolution,created,updated&maxResults=1000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getWorklogCurrentIssue = async (issueKey) => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/issue/${issueKey}/worklog?maxResults=5000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getAllDataUser = async () => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/all-user`;
  return fetchWithAuth(url, { method: 'GET' });
};

const getTimeLeaveTotal = async (username) => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/timeleave/${username}`;
  return fetchWithAuth(url, { method: 'GET' });
};

const getTimeLeave = async (username) => {
  const url = `${process.env.NEXT_PUBLIC_APP_API_PATH}/V1/leave/${username}`;
  return fetchWithAuth(url, { method: 'GET' });
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
