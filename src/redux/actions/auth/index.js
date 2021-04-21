
import { history } from "../../../history"
import config from "../../../configs/config"
import {Axios} from "../root"
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify';
import axios from 'axios'

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

export const SessionCheck = () => {
  return dispatch => {
    var token = localStorage[config.token];
    if(token){
      dispatch({
        type: "LOGIN_WITH_JWT",
        payload: jwt_decode(token),
        isLoggedIn: true
      })
    }
  }
}

export const Logout = () => {
    return dispatch => {
        localStorage.removeItem([config.token]);
        localStorage.removeItem([config.expire])
        history.push('/login')
    }
}

export const is_session = () => {
  if(localStorage[config.token] && localStorage[config.token] !== "undefined"){
    if(!localStorage[config.expire] && localStorage[config.expire] === "undefined")
      return false;
    if(Date.now() - parseInt(localStorage[config.expire]) > config.expireTime)
      return false;
    return true;
  }else{
    return false;
  }
}

export const signupWithJWT = (username, email, password, role) => {
  return dispatch => {
    Axios.post("users/signup", {
        username,
        email,
        password,
        role
      })
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
        } else if(response.data.status){
          history.push('/login')
        }
      })
      .catch(err => console.log(err))
  }
}

export const signinWithJWT = (email, password) => {
    return dispatch => {
      Axios.post("users/login", {
          email: email,
          password: password
        })
        .then(response => {
          var loggedInUser
          if(response.data.status){
            loggedInUser = response.data.token
            localStorage.setItem(config.token, loggedInUser)
            localStorage.setItem(config.expire, Date.now());
            const user = jwt_decode(loggedInUser)
            dispatch({
              type: "LOGIN_WITH_JWT",
              payload: user,
              isLoggedIn: true
            })
            if (user.role === "client")
              history.push("/order")
            else if (user.role === "stuff")
              history.push("/order_management")
            else if (user.role === "admin")
              history.push("/upload_inventory")
            else if (user.role === "superAdmin")
            history.push("/")
          }
          else{
              toast.error(response.data.msg);
          }
        })
        .catch(err => toast.error(err.toString()))
    }
  }

export const forgotpassword_send = data =>{
  return async(dispatch)=>{
    var rdata = await axios.post(config.base_url + 'users/forgotpassword_send',{username : data.username})
    if(rdata.data.status){
      toast.success('An username with your password reset link has been sent, if the provided username address is registered with us.');
      history.push('/login')
      // return dispatch({
      //   type: "RESET_PASSWORD_username_SENT",
      //   data: true
      // })
    }else{
      toast.error(rdata.data.data + " Please send again!");
    }
  }
}

export const forgotpassword_receive = data =>{
  return async dispatch=>{
    var rdata = await  axios.post(config.base_url + 'users/forgotpassword_receive',{data : data})
    if(rdata.status){
      toast.success("success");
      dispatch({
        type : "FORGOTPASSWORD",
        data : rdata.data
      })
    }else{
      toast.error("server error");
      // window.location.assign("/")
    }
  }
}

export const resend_username = data =>{
  return async dispatch =>{
    var rdata = await  axios.post(config.base_url + "users/resend_username",{username : data});
    if(rdata.status){
      toast.success("success");
      history.push("/")
    }else{

    }
  }
}

export const forgotpassword_set = data =>{
  return async dispatch =>{
    var rdata = await  axios.post(config.base_url + "users/forgotpassword_set",{data : data});
    if(rdata.data.status){
      toast.success("Successfully Reset!");
      window.location.assign("/");
    }else{
      toast.error("Server Error!")
    }
  }
}
