import React, { Component } from "react"
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

const roles = [
  {value:config.role.admin, label:config.role.admin},
  {value:'EdDN', label:'EdDN'},
]

const status = [
  {value:"Activado", label:"Activado"},
  {value:"desactivado", label:"desactivado"},
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
    username: "",
    email: "",
    password: "",
    role: 'EdDN',
    status: "activado",
    new_password: "",
    old_password: "",
    // avatar: "",
    // stream_pic: "",
    // reveal: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.addNew && prevProps !== this.props) {
      this.setState({
        _id: "",
        username: "",
        email: "",
        password: "",
        role: config.role.stuff,
        status: "active",
        // reveal: false,
        // avatar: "",
      })
    }
    else if(this.props.data && prevProps !== this.props){
      this.setState({
        _id: this.props.data._id,
        username: this.props.data.username,
        email: this.props.data.email,
        password: this.props.data.password,
        role: this.props.data.role,
        status: this.props.data.status,
        // avatar: this.props.data.avatar,
      })
    }
  }

  handleSubmit = async obj => {
    console.log("State: ", obj);
    if(!obj.username || !obj.email){
      toast.error("Ingrese los cambios correctamente.");
      return;
    }

    if(this.props.userinfo.role === config.role.stuff){
      obj.role = config.role.client;
      obj.manager = this.props.userinfo.id;
    }

    if (!this.props.addNew) {
      await this.props.updateData(obj)
    } else {
      delete obj._id;
      await this.props.addData(obj)
    }
    // let params = Object.keys(this.props.dataParams).length ? this.props.dataParams : { page: 1, perPage: 4 }
    let params = { page: 1, perPage: 10 }
    this.props.handleSidebar(false, true)
    if(this.props.userinfo.role === config.role.stuff){
      this.props.getUsers(params, this.props.userinfo.id)
    }
    else
      this.props.getUsers(params)
  }

  render() {
    let { show, handleSidebar, data } = this.props
    let {username} = this.state
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show
        })}>
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "Actualizar usuario" : "Agregar Usuario"}</h4>
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
                    <Label for="username">Nombre del usuario</Label>
                    <Input
                      type="text"
                      id="username"
                      value={username}
                      disabled={this.props.onlyView?true:false}
                      onChange={e => this.setState({ username: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Correo Electrónico</Label>
                    <Input
                      type="email"
                      id="email"
                      value={this.state.email}
                      disabled={this.props.onlyView?true:false}
                      onChange={e => this.setState({ email: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Contraseña</Label>
                    <Input
                      type="password"
                      id="password"
                      value={this.state.password}
                      disabled={this.props.onlyView?true:false}
                      onChange={e => this.setState({ password: e.target.value })} />
                  </FormGroup>

                  {this.props.userinfo.role === config.role.superAdmin ? <FormGroup>
                    <Label for="role">Rol</Label>
                    <Select
                      className="React mr-3"
                      classNamePrefix="select"
                      disabled={this.props.onlyView?true:false}
                      name="role"
                      value={{value:this.state.role,label:this.state.role}}
                      options={roles}
                      onChange={e => this.setState({role: e.value})}
                      >
                    </Select>
                  </FormGroup> : null}

                  <FormGroup>
                    <Label for="data-skintype">Estado</Label>
                    <Select
                      className="React mr-3"
                      disabled={this.props.onlyView?true:false}
                      classNamePrefix="select"
                      value={{value:this.state.status,label:this.state.status}}
                      name="status"
                      options={status}
                      onChange={e => this.setState({ status: e.value })}
                      >
                    </Select>
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

