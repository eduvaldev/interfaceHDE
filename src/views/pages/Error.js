import React from "react"
import { Card, CardBody, Row, Col } from "reactstrap"
import errorImg from "../../assets/img/logo/logo3x.png"

class Error404 extends React.Component {
  render() {
    return (
      <Row className="m-0">
        <Col sm="12">
          <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
            <CardBody className="text-center">
              <img
                src={errorImg}
                alt="ErrorImg"
                className="img-fluid align-self-center"
              />
              <h1 className="font-large-2 my-1">404 - Page Not Found!</h1>
              <p className="pt-2 mb-0">
                Oops.… Looks like the link you are looking for is no longer valid.
              </p>
              <p className="pb-2">
                Please contact Bonita Laser at +1(647) 780-0207 or info@bonitalaser.ca
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default Error404
