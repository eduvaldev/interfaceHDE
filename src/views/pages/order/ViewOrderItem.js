import React from 'react'
import {
  Input,
  Row,
  Col,
  Table,
  FormGroup,
  Label
} from 'reactstrap'
import { Check } from "react-feather"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const ViewOrderItem = (props) => {
  const {item, children} = props
  return <Row className="mt-1">
           <Col sm="6">
             <Table responsive borderless className="text-center">
               <thead>
                 <tr key="header">
                   <th key="referencia">Referencia</th>
                   <th key="descripcion">Descripcion</th>
                   <th key="qty">Cantidad</th>
                 </tr>
               </thead>
               <tbody>
                 {item.implants.map((it) => {
                   return (
                     <tr key={it._id}>
                       <td>{it.referencia}</td>
                       <td style={{minWidth: '230px'}}>{it.Descripcion}</td>
                       <td>{it.qty}</td>
                     </tr>
                   )
                   })}
               </tbody>
             </Table>
           </Col>
           <Col sm="6">
               <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label for="pickup-date">Fecha de entrega deseada</Label>
                    <DatePicker selected={new Date(item.comment.deliveryDate)} disabled />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="pickup-date">Fecha de recogida deseada</Label>
                    <DatePicker selected={new Date(item.comment.pickupDate)} disabled />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="payment-date">Fecha de pago deseada</Label>
                    <DatePicker selected={new Date(item.comment.paymentDate)} disabled/>
                  </FormGroup>
                </Col>
                 <Col sm="6">
                   <FormGroup>
                     <Checkbox
                       color="primary"
                       disabled
                       icon={<Check className="vx-icon" size={16} />}
                       checked={item.comment.motor}
                       label="Requiere motor?"
                     />
                   </FormGroup>
                 </Col>
                 <Col sm="6">
                   <FormGroup>
                     <Checkbox
                       disabled
                       color="primary"
                       icon={<Check className="vx-icon" size={16} />}
                       checked={item.comment.kos}
                       label="Requiere caja KOS?"
                     />
                   </FormGroup>
                 </Col>
                 <Col sm="6">
                   <FormGroup>
                     <Checkbox
                       disabled
                       color="primary"
                       icon={<Check className="vx-icon" size={16} />}
                       checked={item.comment.bcs}
                       label="Requiere caja BCS?"
                     />
                   </FormGroup>
                 </Col>
                 <Col sm="6">
                   <FormGroup>
                     <Checkbox
                       disabled
                       color="primary"
                       icon={<Check className="vx-icon" size={16} />}
                       checked={item.comment.hexa}
                       label="Requiere caja HEXA?"
                     />
                   </FormGroup>
                 </Col>
                 <Col sm="12">
                   <FormGroup>
                     <Checkbox
                       disabled
                       color="primary"
                       icon={<Check className="vx-icon" size={16} />}
                       checked={item.comment.mangos}
                       label="Requiere caja de mangos?"
                     />
                   </FormGroup>
                 </Col>
                 <Col sm="12">
                   <FormGroup>
                       <Label for="patient">Commentarios</Label>
                       <Input
                         disabled
                         type="text"
                         placeholder="Commentarios"
                         value={item.comment.comment}
                       />
                     </FormGroup>
                 </Col>
               </Row>
           </Col>
           <Col sm="12">
             {children || null}
           </Col>
         </Row>
 }
