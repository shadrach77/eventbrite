import { api_url } from './config';

export const api = async (
  path: string,
  method: 'POST' | 'GET' | 'DELETE' | 'PATCH',
  data?: {
    body?: Record<string, unknown> | FormData;
    contentType?: 'application/json' | 'application/x-www-form-urlencoded';
  },
  token?: string,
) => {
  const headers: HeadersInit = {};
  if (data?.contentType) headers['Content-Type'] = data.contentType;
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(api_url + path, {
    method,
    body:
      data?.body instanceof FormData ? data.body : JSON.stringify(data?.body),
    headers: headers,
  });

  const json = await res.json();
  if (res.status > 299) throw new Error(json.message);
  return json;
};
