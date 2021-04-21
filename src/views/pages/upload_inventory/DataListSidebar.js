import React, { Component } from "react"
import NumericInput from "react-numeric-input"
import { Label, Input, FormGroup, Button, Row, Col, CustomInput } from "reactstrap"
import * as Icon from "react-feather"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import classnames from "classnames"
import "flatpickr/dist/themes/light.css"
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Select from "react-select"
import { toast } from "react-toastify"
import config from "../../../configs/config"
import { connect } from "react-redux"
import { mobileStyle } from "./InputStyle"

const roles = [
  {value:config.role.admin, label:config.role.admin},
  {value:config.role.stuff, label:config.role.stuff},
]

const status = [
  {value:"active", label:"active"},
  {value:"deactived", label:"deactived"},
]

const getToday=()=>{
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return year + "-" + month + "-" + dt;
}

const uuidv4 = () => {

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class DataListSidebar extends Component {
  state = {
    _id: "",
    referencia: "",
    descripcion: "",
    cantidad: 0
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.addNew && prevProps !== this.props) {
      this.setState({
        _id: "",
        referencia: "",
        descripcion: "",
        cantidad: 0
      })
    }
    else if(this.props.data && prevProps !== this.props){
      this.setState({
        _id: this.props.data._id,
        referencia: this.props.data.referencia,
        descripcion: this.props.data.descripcion,
        cantidad: this.props.data.cantidad
      })
    }
  }

  handleSubmit = async obj => {

    if (!this.props.addNew) {
      await this.props.updateData(obj)
    } else {
      delete obj._id;
      await this.props.addData(obj)
    }
    // let params = Object.keys(this.props.dataParams).length ? this.props.dataParams : { page: 1, perPage: 4 }
    let params = { page: 1, perPage: 10 }
    this.props.handleSidebar(false, true)
    this.props.getInventories(params)
  }

  render() {
    const { show, handleSidebar, data } = this.props
    let { referencia, descripcion, cantidad } = this.state
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show
        })}>
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "Actualizar Inventario" : "Agregar al Inventario"}</h4>
          <X size={20} onClick={() => handleSidebar(false, true)} />
        </div>
        <PerfectScrollbar
          className="px-2 mt-1"
          options={{ wheelPropagation: false }}>
                {/* <Col sm={6}>
                  {this.state.avatar?<img src={`${config.host}${this.state.avatar}`} height="150"></img>:null}
                </Col>
                <Col sm={6}>
                  {this.state.stream_pic?<img src={`${config.host}${this.state.stream_pic}`} height="150"></img>:null}
                </Col> */}
                  <FormGroup>
                    <Label for="referencia">Referencia</Label>
                    <Input
                      type="text"
                      id="referencia"
                      value={referencia}
                      disabled={this.props.onlyView}
                      onChange={e => this.setState({ referencia: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="descripcion">Descripcion</Label>
                    <Input
                      type="text"
                      id="descripcion"
                      value={descripcion}
                      disabled={this.props.onlyView}
                      onChange={e => this.setState({ descripcion: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Cantidad</Label>
                    <NumericInput
                      min={0}
                      max={999999999}
                      value={cantidad}
                      disabled={this.props.onlyView}
                      mobile
                      style={mobileStyle}
                      onChange={e => this.setState({cantidad: e})}
                    />
                  </FormGroup>
          {this.props.onlyView?null:(
            <div className="text-right mt-2">
              <Button color="primary" className="mb-1" onClick={() => this.handleSubmit(this.state)}>
                {data !== null ? "Actualizar" : "Agregar"}
              </Button>
              <Button
                className="ml-1 mb-1"
                color="danger"
                outline
                onClick={() => handleSidebar(false, true)}>
                Cancelar
              </Button>
            </div>

          )}
        </PerfectScrollbar>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userNotes: state.users.user_notes,
  }
}

export default connect(mapStateToProps, {})(DataListSidebar)

