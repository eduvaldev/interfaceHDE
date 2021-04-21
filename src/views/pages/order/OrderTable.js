import React from 'react'
import {
  Button
} from 'reactstrap'
import AppCollapse from "../../../components/@vuexy/app-collapse"
import { ViewOrderItem } from './ViewOrderItem'

const buildItem = (item, isDrafted, onRemove, onEdit, onConfirmOrder) => {
  const draftItem = isDrafted ? (
  <div className="d-flex justify-content-between">
    <div>
      <Button color="danger" onClick={e => onRemove(item)}>Eliminar Orden</Button>
    </div>
    <div>
      <Button color="primary" className="mr-1" onClick={e => onEdit(item)}>Editar</Button>
      <Button color="success" onClick={e => onConfirmOrder(item)}>Confirmar Orden</Button>
    </div>
  </div>
  ) : null
  return {
    title: `${item.patient.name} - ${item.patient.document} - ${item.createdAt}`,
    content: <ViewOrderItem item={item}>{draftItem}</ViewOrderItem>
  }
}

const OrderTable = (props) => {

  const collapseItems = props.data.map(item => buildItem(item, props.isDrafted, props.onRemove, props.onEdit, props.onConfirmOrder))

  return(
    <AppCollapse data={collapseItems} type='shadow' accordion />
  )
}

export default OrderTable
