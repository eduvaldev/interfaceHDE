import {Axios} from "../root"
import { toast } from 'react-toastify'
import { history } from '../../../history'
import config from "../../../configs/config"
import { Logout } from '../../../redux/actions/auth'

export const getUsers = (params, userId) => {
    return async dispatch => {
      var return_data = null;
      await Axios.post("users/all",{userId}).then(response => {
        return_data = response;
        let rdata = return_data;
        let { page, perPage } = params;
        let totalPages = Math.ceil(rdata.data.length / perPage);
        let fdata = [];
        let newparams = {};
        if (page !== undefined && perPage !== undefined) {
          let calculatedPage = (page - 1) * perPage;
          let calculatedPerPage = page * perPage;
            if(calculatedPage > rdata.data.length){
            totalPages = Math.ceil(rdata.data.length / perPage);
            fdata = rdata.data.slice(0, perPage);
            newparams['page'] = 0;
            newparams['perPage'] = perPage;
          }else{
            fdata = rdata.data.slice(calculatedPage, calculatedPerPage);
            newparams = params;
          }
        }else {
          totalPages = Math.ceil(rdata.data.length / perPage);
          fdata = rdata.data.slice(0, perPage);
          newparams = params;
        }
        if(fdata.length === 0){
          newparams['page'] = 0;
          newparams['perPage'] = perPage;
          fdata = rdata.data.slice(0, perPage);
        }
        dispatch({ type: "USER_ALL_DATA", data: rdata.data })
        dispatch({
          type: "SESSIONS_DATA",
          data: fdata,
          totalPages: totalPages,
          newparams
        })
      });
    }
  }

  export const filterData = value => {
    return dispatch => dispatch({ type: "FILTER_SESSIONS_DATA", value })
  }

  export const profile = obj => {
    return async dispatch => {
      await Axios
        .post("users/profile",obj)
        .then(response => {
          if(!response.data.status){
            toast.error(response.data.msg);
          }
          else{
            dispatch({ type: "GET_PROFILE", data: response.data.data, note: response.data.note });
          }
        })
    }
  }

  export const deleteData = obj => {
    return async dispatch => {
      var return_data = null;
      await Axios
        .post("users/delete",obj)
        .then(response => {
          if(!response.data.status){
            toast.error('Internal Server');
          }
        })
    }
  }

  export const updateData = (obj, isUser) => {
    return async (dispatch, getState) => {
      await Axios
        .post("users/update", obj)
        .then(response => {
          if(!response.data.status){
            toast.error('Internal Server Error!');
          }
          else{
            toast.success("Success!");
            if(isUser){
              localStorage.removeItem([config.token]);
              localStorage.removeItem([config.expire])
              history.push('/login')
            }
          }
        })
    }
  }

  export const addData = obj => {
    return async (dispatch, getState) => {
      var return_data = null;
      await Axios
        .post("users/add", obj)
        .then(response => {
          if(!response.data.status){
            toast.error(response.data.msg);
          }
        })
    }
  }

  export const addLog = obj => {
    return async (dispatch, getState) => {
      var return_data = null;
      await Axios
        .post("users/stream-key-logger", obj)
        .then(response => {
          return_data = response.data
        })
        if(!return_data.status){
          toast.error("Log Error");
        }
    }
  }
