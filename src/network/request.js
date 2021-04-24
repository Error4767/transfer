import axios from 'axios';

let request = axios.create({});

request.CancelToken = axios.CancelToken;

export {
  request
}