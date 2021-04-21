import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Check } from "react-feather"
import DataTable from "react-data-table-component"
import { toast } from "react-toastify"

import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import {
  getInventories
} from "../../../redux/actions/inventory"
import {
  createOrder
} from "../../../redux/actions/order"
import Checkout from "./Checkout"
import { alertSuccess } from "../../../components/alert"

const CustomHeader = props => {
  return (
    <div className="position-relative has-icon-left mb-1">
      <Input value={props.value} onChange={e => props.handleFilter(e)} placeholder="buscar..." />
      <div className="form-control-position">
        <Search size="15" />
      </div>
    </div>
  )
}

const columns = [
  {
    name: "Referencia",
    selector: "referencia",
    sortable: true
  },
  {
    name: "Descripcion",
    selector: "descripcion",
    sortable: true
  }
]

const Inventories = (props) => {
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')

  useEffect(()=>{
    setFilteredData(props.data)
  }, [props.data])

  const handleFilter = e => {
    const searchText = e.target.value
    setValue(searchText)
    let filterData = []
    if (searchText.length) {
      filterData = props.data.filter(item => {
        let startsWithCondition =
          item.referencia.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.descripcion.toLowerCase().startsWith(searchText.toLowerCase())
        let includesCondition =
          item.referencia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(searchText.toLowerCase())

        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      setFilteredData(filterData)
    }
    else{
      setFilteredData(props.data)
    }
  }

  return (
    <Card className={props.show ? 'd-block' : 'd-none'}>
      <CardHeader>
        <CardTitle>Elije el implante</CardTitle>
      </CardHeader>
      <CardBody>
        <DataTable
          data={filteredData}
          columns={columns}
          noHeader
          subHeader
          subHeaderComponent={
            <CustomHeader value={value} handleFilter={handleFilter} />
          }
          pagination
          selectableRows
          selectableRowsComponent={Checkbox}
          Clicked
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm"
          }}
          onSelectedRowsChange={props.handleChange}
        />
      </CardBody>
    </Card>
  )
}

const OrderModal = (props) => {
  const [centeredModal, setCenteredModal] = useState(true)
  const [selectedImplants, setSelectedImplants] = useState([])
  const [checkout, setCheckout] = useState(false)
  const [checkedImplants, setCheckedImplants] = useState([])
  const [rejectedImplants, setRejectedImplants] = useState([])
  const [patient, setPatient] = useState({
    name: '',
    document: ''
  })
  const [comment, setComment] = useState({
    motor: false,
    kos: false,
    bcs: false,
    hexa: false,
    mangos: false,
    comment: "",
    pickupDate: new Date(),
    paymentDate: new Date(),
    deliveryDate: new Date(),
  })

  const dispatch = useDispatch()
  useEffect(()=> {
    dispatch(getInventories({page:0, perPage: 10}))
  }, [])
  const data = useSelector(state=> state.inventory.allData)
  const user = useSelector(state=> state.auth.userinfo)

  const handleChange = (state) => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    const implants = state.selectedRows.map(item => {
      item.qty = 1
      return item
    })
    setSelectedImplants(implants)
  };

  const handleDraft = () => {
    const finalOrder = {}
    finalOrder.client = user.id
    finalOrder.patient = patient
    finalOrder.implants = checkedImplants.map(item => {
      return {
        implant: item._id,
        referencia: item.referencia,
        Descripcion: item.descripcion,
        qty: item.qty
      }
    })
    finalOrder.comment = comment
    finalOrder.isDraft = true
    alertSuccess('Aceptada', 'La orden guardada se eliminará después de 3 horas automáticamente.')
    dispatch(createOrder(finalOrder))
    setTimeout(() => {
      props.onCreatedOrder()
    }, 100)
  }

  const handleCheckout = () => {
    if (checkout) {
      //Order
      if (!patient.name || !patient.document) {
        toast.error('Por favor, introduzca la información del paciente.')
        return
      }

      const finalOrder = {}
      finalOrder.client = user.id
      finalOrder.patient = patient
      finalOrder.implants = checkedImplants.map(item => {
        
        return {
          implant: item._id,
          referencia: item.referencia,
          qty: item.qty,
          Descripcion: item.descripcion,
          isReplacement: item.isReplacement || false
        }
      })
      finalOrder.comment = comment
      finalOrder.rejectedImplants = rejectedImplants.map(item => {
        return {
          implant: item._id
        }
      })
      console.log(finalOrder)
      alertSuccess('Enviada', 'Por favor realice sus pedidos con una anticipación no inferior a las 24 horas hábiles a la cirugía que tiene programada');
      dispatch(createOrder(finalOrder));
      setTimeout(() => {
        props.onCreatedOrder()
      }, 100);
    }
    else {
      if (selectedImplants.length < 1) {
        toast.warning("Por favor, elija al menos un implante.");
        return
      }

      setCheckout(!checkout);
    }
  }


  return (
    <div className='demo-inline-spacing'>
      <div className='vertically-centered-modal'>
        <Modal
          isOpen={centeredModal}
          toggle={() => setCenteredModal(!centeredModal)}
          className='modal-dialog-centered'
          style={{maxWidth: '70%'}}
          onClosed={props.onHideModal}
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Crear Orden</ModalHeader>
          <ModalBody>
            <Inventories data={data} handleChange={handleChange} show={!checkout} />
            <Checkout
              show={checkout}
              implants={selectedImplants}
              comment={comment}
              setComment={setComment}
              checkedImplants={checkedImplants}
              setCheckedImplants={setCheckedImplants}
              patient={patient}
              setPatient={setPatient}
              rejectedImplants={rejectedImplants}
              setRejectedImplants={setRejectedImplants}
            />
          </ModalBody>
          <ModalFooter>
            <div className="d-flex justify-content-between w-100">
              <div>
                {checkout?<Button color="warning" onClick={() => handleDraft()}>Guardar como borrador</Button>:null}
              </div>
              <div>
                {checkout ? <Button color='danger' onClick={() => setCheckout(!checkout)}>Atras</Button> : null}
                <Button 
                  color={checkout ? 'success' : 'primary'} 
                  className="ml-1" 
                  onClick={() => handleCheckout()}
                >{checkout ? 'Confirmar Orden' : 'Continuar'}</Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default OrderModal
