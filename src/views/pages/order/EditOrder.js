import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

import Checkout from "./Checkout"
import { alertWarning } from "../../../components/alert"

const EditModal = (props) => {
  const [centeredModal, setCenteredModal] = useState(true)
  const [checkedImplants, setCheckedImplants] = useState([])
  const [patient, setPatient] = useState({
    name: '',
    document: ''
  })
  const [comment, setComment] = useState({
    pickupDate: new Date(),
    paymentDate: new Date(),
    motor: false,
    kos: false,
    bcs: false,
    hexa: false,
    mangos: false,
    comment: ""
  })

  useEffect(()=> {
    setPatient(props.item.patient)
    setComment(props.item.comment)
    const implants = props.item.implants.map(item => {
      item.implant.qty = item.qty
      return item.implant
    })
    setCheckedImplants(implants)
  }, [props.item])

  const handleCheckout = () => {
      //Order
    if (!patient.name || !patient.document) {
      alertWarning('Warning', 'Please input the patient information.')
      return
    }

    const finalOrder = {}
    finalOrder._id = props.item._id
    finalOrder.client = props.user.id
    finalOrder.patient = patient
    finalOrder.implants = checkedImplants.map(item => {
      return {
        implant: item._id,
        qty: item.qty
      }
    })
    finalOrder.comment = comment
    finalOrder.isDraft = false
    props.onEdited(finalOrder)
  }

  return (
    <div className='demo-inline-spacing'>
      <div className='vertically-centered-modal'>
        <Modal
          isOpen={centeredModal}
          toggle={() => setCenteredModal(!centeredModal)}
          className='modal-dialog-centered'
          style={{maxWidth: '70%'}}
          onClosed={props.onHideEdit}
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Edit Order</ModalHeader>
          <ModalBody>
            <Checkout
              show
              implants={checkedImplants}
              comment={comment}
              setComment={setComment}
              checkedImplants={checkedImplants}
              setCheckedImplants={setCheckedImplants}
              patient={patient}
              setPatient={setPatient}
              isEdit
            />
          </ModalBody>
          <ModalFooter>
              <Button color='success'  onClick={() => handleCheckout()}>Confirm Order</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default EditModal
