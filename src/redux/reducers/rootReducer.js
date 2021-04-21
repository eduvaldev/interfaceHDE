import { combineReducers } from "redux"
import customizer from "./customizer/"
import auth from "./auth"
import navbar from "./navbar/Index"
import usersReducer from "./users"
import inventoryReducer from "./inventory"
import orderReducer from "./order"

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  users : usersReducer,
  inventory: inventoryReducer,
  order: orderReducer
})

export default rootReducer
