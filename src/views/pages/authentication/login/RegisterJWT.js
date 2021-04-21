import React from "react"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth"
import { history } from "../../../../history"
import Select from "react-select"
import { toast } from "react-toastify"

class RegisterJWT extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPass: "",
    role: "client"
  }


  handleRegister = e => {
    e.preventDefault()
    if(this.state.password != this.state.confirmPass){
      toast.error('Confirm password does not match')
      return;
    }
    this.props.signupWithJWT(
      this.state.username,
      this.state.email,
      this.state.password,
      this.state.role
      )
    }

    render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Nombre del Doctor"
            required
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <Label>Nombre del Doctor</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Correo Electrónico"
            required
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <Label>Correo Electrónico</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <Label>Password</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            required
            value={this.state.confirmPass}
            onChange={e => this.setState({ confirmPass: e.target.value })}
          />
          <Label>Confirm Password</Label>
        </FormGroup>
        {/* <FormGroup>
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label=" I accept the terms & conditions."
            defaultChecked={true}
          />
        </FormGroup> */}
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Login
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit">
            Register
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT)
