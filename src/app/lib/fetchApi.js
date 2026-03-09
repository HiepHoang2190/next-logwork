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
        // GET requests must not carry Content-Type (Jira returns 400 "No content
        // to map…"). Non-GET requests must explicitly declare application/json
        // or Jira returns 415 when axios falls back to form-urlencoded.
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
    console.log(error.response)
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
  const nextMonth = Number(month) + 1 > 12 ? 1          : Number(month) + 1;
  const nextYear  = Number(month) + 1 > 12 ? Number(year) + 1 : year;
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=(worklogAuthor%20in%20(%22${username}%22))%20AND%20(worklogDate%20%3E%3D%20%27${year}-${month}-01%27%20and%20worklogDate%20%3C%20%27${nextYear}-${nextMonth}-01%27)%20ORDER%20BY%20key%20ASC%20&fields=summary%2Cworklog%2Ccreated%2Cupdated%2Cissuetype%2Cparent%2Cproject%2Cstatus%2Cassignee%2Creporter%2Caggregatetimespent%2Ctimeoriginalestimate%2Ctimeestimate&maxResults=1000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getUserCurrentIssues = async () => {
  const url = `${process.env.NEXT_PUBLIC_APP_JIRA_API_PATH}/api/2/search?jql=assignee%3DcurrentUser()%20AND%20resolution%3DUnresolved%20and%20status%20!%3D%20Closed%20ORDER%20BY%20created%20ASC&fields=issuetype%2Csummary%2Creporter%2Cpriority%2Cstatus%2Cresolution%2Ccreated%2Cupdated&maxResults=1000`;
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
