const initialState = {
  userinfo: null,
  isLoggedIn : false,
  userRole:'client'
}
const auth = (state = initialState, action) => {
  switch (action.type) {

    case "LOGIN_WITH_JWT": {
      return { ...state, userinfo: action.payload,isLoggedIn: action.isLoggedIn, userRole: action.payload.role }
    }
    case "RESET_PASSWORD_EMAIL_SENT": {
      return { ...state, pass_email_sent: action.data }
    }
    default: {
      return state
    }
  }
}

export default auth