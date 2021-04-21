import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button
} from "reactstrap"
import { connect } from "react-redux"
import {
  uploadInventory
} from "../../../redux/actions/inventory"
import { Row, Col } from "reactstrap"
import queryString from "query-string"
import ListViewConfig from "./DataListConfig"

class UploadInventory extends React.Component{
  constructor(){
    super();
    this.state={
      file : null,
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.newUrl !==this.props.newUrl){
      this.setState({value : this.props.newUrl})
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.uploadInventory(this.state.file)
  }

  render(){
    return (
      <>
      <Card>
        <CardHeader>
          <CardTitle>Cargar inventario</CardTitle>
        </CardHeader>
        <CardBody>
          <input
            type="file"
            id="upload-inventory"
            onChange={e =>
                this.setState({ file: e.target.files[0]})
            }
          />
          <Button.Ripple
           className="mr-1" color="primary"
           onClick={e => this.handleSubmit(e)}
           >Cargar</Button.Ripple>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
        </CardHeader>
        <CardBody>
          <React.Fragment>
            <Row>
              <Col sm="12">
                <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} />
              </Col>
            </Row>
          </React.Fragment>
        </CardBody>
      </Card>
      </>
    )
  }
}
const mapStateToProps = (state) => (
  {
  // newUrl : state.customer.newGeneratedUrl
  }
)

export default connect(mapStateToProps, {
  uploadInventory
})(UploadInventory)
