import {Axios} from "../root"
import { toast } from 'react-toastify'
import { history } from '../../../history'
import config from "../../../configs/config"

export const getInventories = (params) => {
    return async dispatch => {
      var return_data = null;
      await Axios.get("inventory/all").then(response => {
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
        dispatch({ type: "INVENTORY_ALL_DATA", data: rdata.data })
        dispatch({
          type: "SESSIONS_DATA",
          data: fdata,
          totalPages: totalPages,
          newparams
        })
      });
    }
}

export const uploadInventory = (file) => {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append('file',file);
      Axios.postFile("inventory/upload", formData)
      .then(response => {
        if(response.data.status) {
          toast.success(response.data.msg);
          const data = response.data.data;
          const totalPages = Math.ceil(data.length / 10);
          dispatch({ type: "INVENTORY_ALL_DATA", data: data })
          dispatch({
            type: "SESSIONS_DATA",
            data: data.slice(0, 10),
            totalPages: totalPages,
            page: 0,
            perPage: 10
          })
        }
        else
          toast.error(response.data.msg);
      })
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "FILTER_SESSIONS_DATA", value })
}

export const deleteData = obj => {
  return async dispatch => {
    var return_data = null;
    await Axios
      .post("inventory/delete",obj)
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
      .post("inventory/update", obj)
      .then(response => {
        if(!response.data.status){
          toast.error('Internal Server Error!');
        }
        else{
          toast.success("Success!");
        }
      })
  }
}

export const addData = obj => {
  return async (dispatch, getState) => {
    await Axios
      .post("inventory/add", obj)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
        }
      })
  }
}
