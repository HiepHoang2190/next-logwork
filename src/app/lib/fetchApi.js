'use server'
import { auth, signIn } from '@/app/auth'

export const authenticate = async (formData) => {
  const { username, password } = formData;
  try {
    await signIn('credentials', { username, password, redirect: false });
    return { success: "Login Success!" };
  } catch (err) {
    return { error: 'Incorrect Password!' };
  }
};

export const fetchWithCredentials = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-CSRF-Token',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if ([400, 401, 403].includes(response.status)) {
        throw new Error('Unauthorized!');
      } else {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
    }
    return response.json();
  } catch (error) {
    return (error.message);
  }
};

const fetchWithAuth = async (url, options = {}) => {
  const { user } = await auth();
  const headers = {
    ...options.headers,
    'Cookie': `JSESSIONID=${user.session.value}`,
  };
  return fetchWithCredentials(url, { ...options, headers });
};

export const getUserIssues = async (username, year, month, lastDayOfMonth) => {
  const url = `${process.env.JIRA_API_PATH}/api/2/search?jql=(worklogAuthor%20in%20(%22${username}%22))%20AND%20(worklogDate%20%3E%3D%20%27${year}-${month}-01%27%20and%20worklogDate%20%3C%20%27${year}-${month}-${lastDayOfMonth}%27)%20&fields=summary%2Cworklog%2Ccreated%2Cupdated%2Cissuetype%2Cparent%2Cproject%2Cstatus%2Cassignee%2Creporter%2Caggregatetimespent%2Ctimeoriginalestimate%2Ctimeestimate&maxResults=1000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getUserCurrentIssues = async () => {
  const url = `${process.env.JIRA_API_PATH}/api/2/search?jql=assignee%3DcurrentUser()%20AND%20resolution%3DUnresolved%20and%20status%20!%3D%20Closed&fields=issuetype%2Csummary%2Creporter%2Cpriority%2Cstatus%2Cresolution%2Ccreated%2Cupdated&maxResults=1000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getWorklogCurrentIssue = async (issueKey) => {
  const url = `${process.env.JIRA_API_PATH}/api/2/issue/${issueKey}/worklog?maxResults=5000`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getAllDataUser = async () => {
  const url = `${process.env.API_PATH}/V1/all-user`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getTimeLeaveTotal = async (username) => {
  const url = `${process.env.API_PATH}/V1/timeleave/${username}`;
  return fetchWithAuth(url, { method: 'GET' });
};

export const getTimeLeave = async (username) => {
  const url = `${process.env.API_PATH}/V1/leave/${username}`;
  return fetchWithAuth(url, { method: 'GET' });
};