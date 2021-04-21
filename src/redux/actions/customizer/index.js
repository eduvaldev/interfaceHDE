import {Axios} from "../root"
import { toast } from 'react-toastify';

export const changeMode = mode => {
  return dispatch => dispatch({ type: "CHANGE_MODE", mode })
}

export const collapseSidebar = value => {
  return dispatch => dispatch({ type: "COLLAPSE_SIDEBAR", value })
}

export const changeNavbarColor = color => {
  return dispatch => dispatch({ type: "CHANGE_NAVBAR_COLOR", color })
}

export const changeNavbarType = style => {
  return dispatch => dispatch({ type: "CHANGE_NAVBAR_TYPE", style })
}

export const changeFooterType = style => {
  return dispatch => dispatch({ type: "CHANGE_FOOTER_TYPE", style })
}

export const changeMenuColor = style => {
  return dispatch => dispatch({ type: "CHANGE_MENU_COLOR", style })
}

export const hideScrollToTop = value => {
  return dispatch => dispatch({ type: "HIDE_SCROLL_TO_TOP", value })
}

export const generateUrl = (sessionTime) => {
  return dispatch => {
    Axios.post("customers/generate_url", {
    session_time: sessionTime
  })
  .then(response => {
    if(response.data.status){
      dispatch({
        type: "GENERATE_URL",
        url: response.data.url
      })

    }
    else{
        toast.error(response.data.msg);
    }
  })
  .catch(err => console.log(err))
  }
}
