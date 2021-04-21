import React, { Suspense, lazy } from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { SessionCheck, is_session } from "./redux/actions/auth"
import { ContextLayout } from "./utility/context/Layout"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from 'react-loader-spinner';

// Route-based code splitting
const Home = lazy(() =>
  import("./views/pages/Home")
)

const UserManagement = lazy(() =>
  import("./views/pages/usermanagement")
)

const Profile = lazy(() =>
  import("./views/pages/usermanagement/Profile")
)

const register = lazy(() =>
  import("./views/pages/authentication/login/Register")
)

const login = lazy(() =>
  import("./views/pages/authentication/login/Login")
)

const resetPassword = lazy(() =>
  import("./views/pages/authentication/login/ResetPassword")
)

const forgotPassword = lazy(() =>
  import("./views/pages/authentication/login/ForgotPassword")
)

const Order = lazy(() =>
  import("./views/pages/order")
)

const UploadInventory = lazy(() =>
  import("./views/pages/upload_inventory")
)

const OrderManagement = lazy(() =>
  import("./views/pages/order-management")
)

const ErrorPage = lazy(() =>
  import("./views/pages/Error")
)

// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    <Component {...props} />
                  </Suspense>
                </LayoutTag>
              )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)
const mapStateToProps = state => {
  return {
    user: state.auth.userRole
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

const RequireAuth = (data) => {
  if (!is_session()) {
    return <Redirect to={'/login'} />;
  }
  return data.children;
};

class AppRouter extends React.Component {
  componentDidMount() {
    this.props.SessionCheck();
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AppRoute
            path="/login"
            component={login}
            fullLayout
          />
          <AppRoute
            path="/forgot_password"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/register"
            component={register}
            fullLayout
          />
          <AppRoute
            path="/reset_password/:param1"
            component={resetPassword}
            fullLayout
          />
          <AppRoute
            path="/error"
            component={ErrorPage}
            fullLayout
          />
          <RequireAuth>
            <AppRoute
              exact
              path="/"
              component={Home}
            />
            <AppRoute
              path="/profile"
              component={Profile}
            />
            <AppRoute
              path="/usermanagement"
              component={UserManagement}
            />
            <AppRoute
              path="/upload_inventory"
              component={UploadInventory}
            />
            <AppRoute
              path="/order"
              component={Order}
            />
            <AppRoute
              path="/order_management"
              component={OrderManagement}
            />
          </RequireAuth>
        </Switch>
        <ToastContainer />
      </Router>
    )
  }
}

const getIsLoggedIn = (state) => (
  {
  // Loading  :state.client.loading,
  isLoggedIn : state.auth.isLoggedIn,
})

const mapDispatchToProps = {
  SessionCheck, is_session
}

export default connect(getIsLoggedIn, mapDispatchToProps)(AppRouter)
