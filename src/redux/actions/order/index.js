import {Axios} from "../root"
import { toast } from 'react-toastify'

export const getOrders = (user, picker = null) => {
  return async dispatch => {
    await Axios.post("order/all", {user, picker}).then(response => {
      dispatch({ type: "ORDER_ALL_DATA", data: response.data })
    });
  }
};

export const clientOrders = (user) => {
  return async dispatch => {
    await Axios.post("order/client", {user}).then(response => {
      console.log(response.data)
      dispatch({type: "ORDER_CLIENT_DATA", data: response.data})
    });
  };
};

export const filterData = value => {
  return dispatch => dispatch({ type: "FILTER_SESSIONS_DATA", value })
};

export const deleteData = obj => {
  return async dispatch => {
    await Axios
      .post("order/delete",obj)
      .then(response => {
        if(!response.data.status){
          toast.error('Internal Server');
        }
      })
  }
};

export const updateData = (obj) => {
  return async (dispatch) => {
    await Axios
      .post("order/update", obj)
      .then(response => {
        if(!response.data.status){
          toast.error('Internal Server Error!');
        }
      })
  }
};

export const createOrder = obj => {
  return async (dispatch, getState) => {
    await Axios
      .post("order/add", obj)
      .then(response => {
        if (!response.data.status){
          toast.error(response.data.msg);
        }
      })
  }
};
