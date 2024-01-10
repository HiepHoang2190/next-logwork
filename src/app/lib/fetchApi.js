'use server'

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
      console.error('Fetch failed:', response);
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to fetch with credentials!');
  }
};

export const fetchData = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'X-CSRF-Token'
    }
  });

  const data = await response.json();
  return data;
};

export const getUserIssue = async (username) => {
  const url = `${process.env.API_PATH}/V1/user/${username}`;
  const data = await fetchData(url);
  const arr = []
  data.map((item) => (
    arr.push(item)
  ));
  return arr
};

export const getAllDataUser = async () => {
  const url = `${process.env.API_PATH}/V1/all-user`;
  const data = await fetchData(url);
  const arr = []
  data.map((item) => (
    arr.push(item)
  ));
  return arr
};

export const getTimeLeaveTotal = async (username) => {
  const url = `${process.env.API_PATH}/V1/timeleave/${username}`;
  const data = await fetchData(url);
  const arr = []

  data.map((item) => (
    arr.push(item)
  ));
  return arr
}

export const getTimeLeave = async (username) => {
  const url = `${process.env.API_PATH}/V1/leave/${username}`;
  const data = await fetchData(url);
  const arr = []
  data.map((item) => (
    arr.push(item)
  ));
  return arr
}