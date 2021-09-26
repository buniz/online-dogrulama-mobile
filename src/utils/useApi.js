import axios from 'axios';

const isDev = false;
export const configureAxiosHeaders = token => {
  axios.defaults.headers.Authorization = token;
};
export const useAPI = () => {
  const defaultHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...axios.defaults.headers,
  };

  const customFetch = ({
    endpoint,
    method = 'GET',
    body = {},
    headers = defaultHeader,
    responseType,
    isMultipart,
  }) => {
    const baseUrl = isDev
      ? 'http://localhost:9000/api'
      : 'http://207.154.252.215:9000/api';
    let url = `${baseUrl}/${endpoint}`;

    const options = {
      method,
      headers,
    };

    if (Object.keys(body).length) {
      options.data = JSON.stringify(body);
    }
    if (responseType) {
      options.responseType = responseType;
    }

    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    return axios(url, options)
      .then(response => {
        let data = null;
        if (response.data.status) {
          data = response.data;
        } else {
        }

        return data;
      })
      .catch(error => {
        return error?.response?.data || {status: false};
      });
  };

  const get = ({endpoint, id, query, token}) => {
    const url = `${endpoint}${
      id ? `/${id}${query ? `?${query}` : ''}` : `${query ? `?${query}` : ''}`
    }`;

    if (token) {
      defaultHeader.Authorization = `Bearer ${token}`;
    }
    return customFetch({endpoint: url});
  };

  const post = ({endpoint, body = {}, isMultipart}) => {
    return customFetch({endpoint, method: 'POST', body, isMultipart});
  };

  const put = ({endpoint, id, body = {}, token, isMultipart}) => {
    if (!id && !body) {
      throw new Error('to make a put you must provide the id and the   body');
    }
    if (token) {
      defaultHeader.Authorization = `Bearer ${token}`;
    }

    const url = `${endpoint}${id ? `/${id}` : ''}`;
    return customFetch({
      endpoint: url,
      method: 'PUT',
      body,
      isMultipart,
      headers: defaultHeader,
    });
  };

  const del = ({endpoint, id, query}) => {
    if (!id) {
      throw new Error('to make a delete you must provide the id and the body');
    }
    const url = `${endpoint}${
      id ? `/${id}${query ? `?${query}` : ''}` : `${query ? `?${query}` : ''}`
    }`;

    return customFetch({endpoint: url, method: 'DELETE'});
  };

  return {
    get,
    post,
    put,
    del,
  };
};
