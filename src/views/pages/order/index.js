import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap'
import OrderModal from './OrderModal'
import EditModal from './EditOrder'
import {
  clientOrders,
  deleteData,
  updateData
} from "../../../redux/actions/order"

import OrderTable from './OrderTable'

import { alert, alertSuccess, alertWarning } from "../../../components/alert"

const Order = () => {
  const [active, setActive] = useState('1')
  const [showOrder, setShowOrder] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editData, setEditData] = useState({})

  const dispatch = useDispatch()
  const user = useSelector(state=> state.auth.userinfo)

  useEffect(()=> {
    
    dispatch(clientOrders(user));
    setInterval(()=>{
      dispatch(clientOrders(user));
    }, 1800000);
  }, [user])

  const createdOrders = useSelector(state=> state.order.createdOrders) || []
  const draftedOrders = useSelector(state=> state.order.draftedOrders) || []
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const handleOrder = () => {
    setShowOrder(!showOrder)
  }

  const onHideModal = () => {
    setShowOrder(false)
  }

  const onCreatedOrder = () => {
    setShowOrder(false)

    dispatch(clientOrders(user))
  }

  //For drafted table

  const handleRemoveConfrim = (item) => {
    return alert.fire({
      title: 'Esta sefuro?',
      text: "Si acepta no podra deshacer cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(deleteData({_id: item._id}))
        alert.fire({
          icon: 'Eliminar',
          title: 'Romovida!',
          text: 'Tu ítem ha sido removido.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        dispatch(clientOrders(user))
      }
    })
  }

  const onRemove = (item) => {
    handleRemoveConfrim(item)
  }

  const onEdit = (item) => {
    setEditData(item)
    setEdit(true)
    dispatch(clientOrders(user))
  }

  const onEdited = (item) => {
    setEdit(false)
    dispatch(updateData(item))
    alertSuccess('Enviada', 'Orden Editada.')
    setTimeout(() => {
      dispatch(clientOrders(user))
    }, 200)
  }

  const onHideEdit = () => {
    setEdit(false)
  }

  const onConfirmOrder = (item) => {
    if (!item.patient.name || !item.patient.document) {
      alertWarning('Inportante', 'Porfavor ingrese la informacion del paciente.')
      return;
    }
    item.isDraft = false;
    dispatch(updateData(item))
    alertSuccess('Enviada', 'Orden Enviada.')
    setTimeout(() => {
      dispatch(clientOrders(user))
    }, 200)
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <Nav tabs>
          <NavItem>
            <NavLink
              className="p-1"
              active={active === '1'}
              onClick={() => {
                toggle('1')
              }}
            >
              <h5>Mis órdenes</h5>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="p-1 ml-1"
              active={active === '2'}
              onClick={() => {
                toggle('2')
              }}
            >
              <h5>Órdenes en borrador</h5>
            </NavLink>
          </NavItem>
        </Nav>
        <Button color="primary" className="bg-primary text-right" onClick={e=>handleOrder()}>Crea una nueva orden</Button>
      </div>
      {showOrder ?
        <OrderModal
          onHideModal={onHideModal}
          onCreatedOrder={onCreatedOrder}
        /> : null}
      {edit ? <EditModal item={editData} onEdited={onEdited} onHideEdit={onHideEdit} user={user} /> : null}
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <OrderTable data={createdOrders} />
        </TabPane>
        <TabPane tabId='2'>
          <OrderTable data={draftedOrders} onRemove={onRemove} onEdit={onEdit} onConfirmOrder={onConfirmOrder} isDrafted />
        </TabPane>
      </TabContent>
    </React.Fragment>
  )
}
export default Order
