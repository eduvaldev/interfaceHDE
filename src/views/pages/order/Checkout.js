import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Row,
  Col,
  Table,
  FormGroup,
  Label
} from 'reactstrap'
import NumericInput from "react-numeric-input"
import { Check } from "react-feather"
import { toast } from 'react-toastify';
import { Badge } from 'reactstrap'
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { mobileStyle } from "../upload_inventory/InputStyle"
import { Axios } from "../../../redux/actions/root"
import "../../../assets/scss/pages/invoice.scss"
import { alertWarning } from "../../../components/alert"
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/light.css"
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const buildImplants = (implants, onChangeQty, onRemove, onReplacements) => {

  return (
    <div className="invoice-items-table pt-1">
      <Row>
        <Col sm="12">
          <Table responsive borderless className="text-center">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {implants.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{item.isReplacement?<Badge color='success' className="mr-1"> Sugerido </Badge>:null}{item.referencia}</td>
                    <td style={{minWidth: '230px'}}>{item.descripcion}</td>
                    <td>
                      <NumericInput
                        min={1}
                        max={item.cantidad}
                        defaultValue={1}
                        value={item.qty}
                        mobile
                        onChange={e => onChangeQty(e, item)}
                        style={mobileStyle}
                      />
                    </td>
                    <td>
                      <div className="d-flex">
                        <Button color="success" onClick={e => onReplacements(item.referencia)} className="mr-2">Reemplazar</Button>
                        <Button color="danger" onClick={e => onRemove(item)}>Borrar</Button>
                      </div>
                    </td>
                  </tr>
                )
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  )
}

const Checkout = (props) => {
  const { show, implants, patient, setPatient, checkedImplants, setCheckedImplants, comment, setComment, isEdit, rejectedImplants, setRejectedImplants } = props

  useEffect(()=>{
    if(!isEdit)
      setCheckedImplants(implants)
  },[implants])

  const onChangeQty = (qty, item) => {
    if(item.cantidad < qty) {
      alertWarning('Advertencia', 'No se encuentran más unidades disponibles para este implante')
      // toast.error("No se encuentran más unidades disponibles para este implante")
      return
    }
    const temp = checkedImplants.map(it => {
      if(it._id === item._id) {
        it.qty = qty
      }
      return it
    })

    setCheckedImplants(temp)
  }

  const onRemove = (imp) => {
    const filteredArray = checkedImplants.filter(item => item._id !== imp._id)
    setCheckedImplants(filteredArray)
    if (imp.isReplacement) {
      const result = rejectedImplants.find( (item) => item._id === imp._id );
      if (!result) {
        const temp = []
        temp.push(imp)
        console.log("RejectedImps: ", rejectedImplants.concat(temp))

        setRejectedImplants(rejectedImplants.concat(temp))
      }
    }
  }

  const onReplacements = (referencia) => {
    Axios.post('order/replacements', {referencia: referencia})
    .then((res) => {
      if(res.data.status){
        const data = res.data.data
        const temp = data.filter(item => {
          if(!item) return false
          for(let i = 0 ; i < checkedImplants.length ; i++) {
            if(checkedImplants[i]._id == item._id){
              return false
            }
          }
          return true
        }).map(item => {
          item.qty = 1
          item.isReplacement = true
          return item
        })

        if(temp.length > 0) {
          setCheckedImplants(checkedImplants.concat(temp))
        }
      } else {
        toast.error(res.data.msg)
      }
    })
  }
  console.log(comment);
  const buildComment = () => {
    return  <Card>
              <CardHeader>
                  <CardTitle>Informacion General</CardTitle>
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col sm="3">
                      <FormGroup>
                        <Label for="patient">Paciente</Label>
                        <Input
                          type="text"
                          id="patient"
                          placeholder="Paciente"
                          required
                          value={patient.name}
                          onChange={e => setPatient({...patient, name: e.target.value})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label for="document">Documento</Label>
                        <Input
                          type="text"
                          id="document"
                          placeholder="Documento"
                          required
                          value={patient.document}
                          onChange={e => setPatient({...patient, document: e.target.value})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label>Fecha de entrega deseada</Label>
                        <DatePicker 
                          selected={new Date(comment.deliveryDate)}
                          minDate={new Date()} 
                          tabIndex={100000000000000000}
                          onChange={date => {
                            console.log(date);
                            setComment({...comment, deliveryDate: date})
                          }} />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label for="pickup-date">Fecha de recogida deseada</Label>
                        <DatePicker 
                          selected={new Date(comment.pickupDate)} 
                          minDate={new Date()} 
                          tabIndex={100000000000000000}
                          onChange={date => {
                            console.log(date);
                            setComment({...comment, pickupDate: date})
                          }} 
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          checked={comment.motor}
                          label="Requiere motor?"
                          onChange={e => setComment({...comment, motor: !comment.motor})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          checked={comment.kos}
                          label="Requiere caja KOS?"
                          onChange={e => setComment({...comment, kos: !comment.kos})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label for="payment-date">Fecha de pago deseada</Label>
                        <DatePicker
                          minDate={new Date()}  selected={new Date(comment.paymentDate)} onChange={date => setComment({...comment, paymentDate: date})} />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          checked={comment.bcs}
                          label="Requiere caja BCS?"
                          onChange={e => setComment({...comment, bcs: !comment.bcs})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          checked={comment.hexa}
                          label="Requiere caja HEXA?"
                          onChange={e => setComment({...comment, hexa: !comment.hexa})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          checked={comment.mangos}
                          label="Requiere caja de mangos?"
                          onChange={e => setComment({...comment, mangos: !comment.mangos})}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <FormGroup>
                          {/* <Label for="patient">Comment</Label> */}
                          <Input
                            type="text"
                            id="comment"
                            placeholder="Comentarios"
                            value={comment.comment}
                            onChange={e => setComment({...comment, comment: e.target.value})}
                          />
                        </FormGroup>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
  }

  const children = buildImplants(checkedImplants, onChangeQty, onRemove, onReplacements)

  return (
    <div className={show ? 'd-block' : 'd-none'}>
        {buildComment()}
        {children}
    </div>
  )
}

export default Checkout
