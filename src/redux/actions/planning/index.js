import axios from "axios"
import { toast } from 'react-toastify';
import {Axios} from "../root"

export const fetchEvents = () => {
  return async dispatch => {
    await Axios
      .get("planning/getEvents")
      .then(response => {
        dispatch({ type: "FETCH_EVENTS", 
        events: response.data.data, gameList: response.data.gameList, 
        accessToken: response.data.accessToken,refreshToken: response.data.refreshToken, channel: response.data.channel,
        gameIds: response.data.gameIds })
      })
      .catch(err => console.log(err))
  }
}

export const tokenValidation = event => {
  return async dispatch => {
    await Axios.post("planning/valid_token", event)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
          return
        }
        else{
          toast.success(response.data.msg);
        }
      })
  }
}

export const testAPI = event => {
  return async dispatch => {
    await Axios.post("planning/twitch_api", event)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
          return
        }
        else{
          toast.success('Success!'); 
        }
      })
  }
}

export const updateAPI = event => {
  return async dispatch => {
    await Axios.post("planning/update_api", event)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
          return
        }
        else{
          toast.success(response.data.msg); 
        }
      })
  }
}

export const handleSidebar = bool => {
  return dispatch => dispatch({ type: "HANDLE_SIDEBAR", status: bool })
}

export const deleteEvent = event => {
  return async dispatch => {
    await Axios.post("planning/delete", event)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
          return
        }
        dispatch({ type: "DELETE_EVENT", event})
      })
  }
}

export const addEvent = event => {
  return async dispatch => {
    await Axios.post("planning/add", event)
      .then(response => {
        if(!response.data.status){
          toast.error(response.data.msg);
          return
        }
        dispatch({ type: "ADD_EVENT", event })
      })
  }
}

export const updateEvent = event => {
  return dispatch => {
      // Axios.post("planning/update", event)
      // .then(response => {
      //   if(!response.data.status){
      //     toast.error(response.data.msg);
      //     return;
      //   }
        dispatch({ type: "UPDATE_EVENT", event })
      //   // fetchEvent()
      // })
  }
}

export const updateDrag = event => {
  return dispatch => {
    dispatch({ type: "UPDATE_DRAG", event })
  }
}

export const updateResize = event => {
  return dispatch => {
    dispatch({ type: "EVENT_RESIZE", event })
  }
}

export const handleSelectedEvent = event => {
  return dispatch => dispatch({ type: "HANDLE_SELECTED_EVENT", event })
}
