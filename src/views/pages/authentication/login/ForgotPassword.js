import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Label
} from "reactstrap"
import fgImg from "../../../../assets/img/pages/forgot-password.png"
import { history } from "../../../../history"
import { connect } from "react-redux"
import { forgotpassword_send } from "../../../../redux/actions/auth"
import "../../../../assets/scss/pages/authentication.scss"
import { toast } from "react-toastify"

class ForgotPassword extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            email: '',
        }
    }

    handleForgot = (e) => {
        // e.preventDefault();
        if (this.state.email === '') {
            toast.warn('Please type the email!');
            return;
        }
        this.props.forgotpassword_send( this.state )
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
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center"
              >
                <img src={fgImg} alt="fgImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 py-1">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Recover your password</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Please enter your email address and we'll send you
                    instructions on how to reset your password.
                  </p>
                  <CardBody className="pt-1 pb-0">
                    {/* <Form
                        // action="/" 
                        onSubmit={this.handleForgot}
                    > */}
                      <FormGroup className="form-label-group">
                        <Input type="text" placeholder="Email" name="email" value={this.state.email} onChange={(e)=> this.setState({email: e.target.value})} required />
                        <Label>Email</Label>
                      </FormGroup>
                      <div className="float-md-left d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          outline
                          className="px-75 btn-block"
                          onClick={() => history.push("/login")}
                        >
                          Back to Login
                        </Button.Ripple>
                      </div>
                      <div className="float-md-right d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          type="button"
                          className="px-75 btn-block"
                          onClick={()=>this.handleForgot()}
                        >
                          Recover Password
                        </Button.Ripple>
                      </div>
                    {/* </Form> */}
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

const getDatas = () => {
    return {

    }
}

export default connect(getDatas, { forgotpassword_send })(ForgotPassword)
