import React from "react"
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  NavLink
} from "reactstrap"
import { Mail, Lock, Check } from "react-feather"
import { history } from "../../../../history"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { connect } from "react-redux"
import { signinWithJWT } from "../../../../redux/actions/auth"

import loginImg from "../../../../assets/img/pages/login.png"
import "../../../../assets/scss/pages/authentication.scss"
import Select from "react-select"

class Login extends React.Component {
  state = {
    activeTab: "1",
    email: "",
    password: "",
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  handleLogin = e => {
    e.preventDefault()
    this.props.signinWithJWT(
      this.state.email,
      this.state.password
    )
  }

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} style={{width:"100%"}} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                      <CardBody>
                        <h4>Bienvenido a IHDE</h4>
                        <p>Inicie sesión en su cuenta</p>
                        <Form onSubmit={this.handleLogin} className="mt-2">
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="text"
                              value={this.state.email}
                              onChange={e => this.setState({ email: e.target.value })}
                              required={true}
                            />
                            <div className="form-control-position">
                              <Mail size={15} />
                            </div>
                            <Label>Correo Electrónico</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="password"
                              placeholder="Contraseña"
                              value={this.state.password}
                              required={true}
                              onChange={e => this.setState({ password: e.target.value })}
                            />
                            <div className="form-control-position">
                              <Lock size={15} />
                            </div>
                            <Label>Contraseña</Label>
                          </FormGroup>
                          <FormGroup className="d-flex justify-content-between align-items-center">
                            <Checkbox
                              color="primary"
                              icon={<Check className="vx-icon" size={16} />}
                              label="Recordarme"
                            />
                            {/* <NavLink className="float-right" onClick={() => history.push("/forgot_password")}>
                              Forgot Password?
                            </NavLink> */}
                          </FormGroup>
                          <div className="d-flex justify-content-between">
                            <Button.Ripple color="primary" outline onClick={() => history.push("/register")}>
                             Registro
                            </Button.Ripple>
                            <Button.Ripple color="primary" type="submit">
                              Iniciar Sesion
                            </Button.Ripple>
                          </div>
                        </Form>
                      </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return {

  }
}
export default connect(mapStateToProps, { signinWithJWT })(Login)
