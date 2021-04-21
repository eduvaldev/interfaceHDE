import axios from "axios"
import config from "../../configs/config"
import { is_session } from "./auth"
import {history} from "../../history"

const ax = axios.create({
  baseURL: config.base_url,
  timeout: 3000000,
  headers: {
      "Content-Type": "application/json",
  },
  maxContentLength: 100000000,
  maxBodyLength: 1000000000
});

export class Axios {
  static post(uri, params){
    if(uri.indexOf('login') > -1 || uri.indexOf('signup') > -1)
      return ax.post(uri, params);
    if(!is_session()){
      localStorage.removeItem([config.token]);
      localStorage.removeItem([config.expire]);
      history.push('/login');
    }

    localStorage.setItem(config.expire, Date.now());
    return ax.post(uri, params);
  }

  static postFile(uri, params){
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };
    if(uri.indexOf('login') > -1 || uri.indexOf('signup') > -1 || uri.indexOf('consent_form') > -1)
      return ax.post(uri, params, config);
    if(!is_session()){
      localStorage.removeItem([config.token]);
      localStorage.removeItem([config.expire]);
      history.push('/login');
    }

    localStorage.setItem(config.expire, Date.now());
    return ax.post(uri, params, config);
  }

  static get(uri, params){
    if(uri.indexOf('login') > -1 || uri.indexOf('signup') > -1 || uri.indexOf('consent_form') > -1)
      return ax.get(uri, params);
    if(!is_session()){
      localStorage.removeItem([config.token]);
      localStorage.removeItem([config.expire]);
      history.push('/login');
    }
    localStorage.setItem(config.expire, Date.now());
    return ax.get(uri, params);
  }
}
