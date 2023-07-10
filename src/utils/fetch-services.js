import axios from 'axios';
//import { NotificationManager } from 'components/common/react-notifications';

const BaseURL = process.env.REACT_APP_BASE_URL;
const postData = async (url, body, token = null) => {
  const jwsToken = localStorage.getItem('jws_token');

  const response = await fetch(`${BaseURL}/${url}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      //  "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hYXJvZ3lhaW5kaWEuaW5cL3RyYWZpa3NvbFwvcHVibGljXC9hcGlcL3YxXC9sb2dpbiIsImlhdCI6MTU5OTEyMzA1MiwiZXhwIjoxNjAxNzE1MDUyLCJuYmYiOjE1OTkxMjMwNTIsImp0aSI6IlJQVmttMHhmcFRzZHpHaGoiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.DFp2qevRXpL5DKJNSyrryVAnGD0BWXm-GiMVQeNq5LQ",
      Authorization: token || jwsToken,
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    //  'content-type': 'multipart/form-data'},
    body: JSON.stringify(body),
  });
  if (response.status === 401) {
    localStorage.clear();
    window.location.reload(false);
  } else if (!(response.status === 200 || response.status === 201)) {
    const { message = 'Something went wrong.' } = await response.json();
    // NotificationManager.error(message, 'Error message', 3000, null, null, '');
  }

  const result1 = await response.json();
  return result1;
};

const getData = async (url) => {
  const jwsToken = localStorage.getItem('jws_token');
  const response = await fetch(`${BaseURL}/${url}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: jwsToken,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  const result2 = await response.json();

  if (response.status === 401) {
    localStorage.clear();
    window.location.reload(false);
  } else if (response.status !== 200) {
    // NotificationManager.error(
    //   result2?.message ?? 'Something Went Wrong',
    //   'Error',
    //   3000,
    //   null,
    //   null,
    //   ''
    // );
  }

  return result2;
};

const axiosPostData = async (url, formData) => {
  return axios
    .post(`${BaseURL}/${url}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: localStorage.getItem('jws_token'),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        localStorage.clear();
        window.location.reload(false);
      } else if (err.response.status !== 200) {
        // NotificationManager.error(
        //   err.response.data.message,
        //   'Error message',
        //   3000,
        //   null,
        //   null,
        //   ''
        // );
      }
    });
};
export { postData, getData, axiosPostData };
