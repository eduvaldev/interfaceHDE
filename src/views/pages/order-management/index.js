import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  ChevronDown,
  Trash,
  Search
} from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Button
} from 'reactstrap'
import { ViewOrderItem } from '../order/ViewOrderItem'
import {
  getOrders,
  deleteData,
  updateData
} from "../../../redux/actions/order"
import { alert } from "../../../components/alert"

const status = [
  {color: "primary", title: "Ordenada"},
  {color: "success", title: "Enviada"},
  {color: "danger", title: "Cancelada"}
]

const ExpandableTable = ({ data, handleStatus }) => {

  return (
    <ViewOrderItem item={data}>
      <div className="text-right w-100 pr-2 mb-1">
        <Button color="success" onClick={e => handleStatus(data._id, 1)}>Enviar</Button>
        <Button color="danger" onClick={e => handleStatus(data._id, 2)} className="ml-1">Cancelar</Button>
      </div>
    </ViewOrderItem>
  )
}

const CustomHeader = props => {
  return (
    <div className="position-relative has-icon-left mb-1">
      <Input value={props.value} onChange={e => props.handleFilter(e)} placeholder="Buscar..." />
      <div className="form-control-position">
        <Search size="15" />
      </div>
    </div>
  )
}

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.deleteRow(props.row)
        }}
      />
    </div>
  )
}

const OrderManagement = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state=> state.auth.userinfo)

  useEffect(()=> {
    dispatch(getOrders(user))
  }, [user])

  const dbData = useSelector(state => state.order.allData) || []
  const data = dbData.map((item, idx) => {
    const orderItem = {}
    orderItem.client = item.client.username
    orderItem.email = item.client.email
    orderItem.patient_name = item.patient.name
    orderItem.document = item.patient.document
    orderItem.createdAt = item.createdAt
    orderItem.comment = item.comment
    orderItem.patient = item.patient
    orderItem.implants = item.implants
    orderItem.status = item.status
    orderItem._id = item._id
    orderItem.id = idx

    return orderItem
  })
  const handleDelete = (item) => {
    return alert.fire({
      title: 'Esta seguro?',
      text: "Al eliminar el envío, no puede deshacer cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(deleteData({_id: item._id}))
        alert.fire({
          icon: 'success',
          title: 'Eliminado!',
          text: 'Se ha eliminado la orden.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        dispatch(getOrders(user))
      }
    })
  }

  const handleStatus = (_id, status) => {
    dispatch(updateData({_id, status}))
    setTimeout(() => {
      dispatch(getOrders(user))
    }, 100)
  }

  const columns = [
    {
      name: 'Doctor',
      selector: 'client',
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'Correo Electrónico',
      selector: 'email',
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'Paciente',
      selector: 'patient_name',
      sortable: true,
      minWidth: '200px'
    },

    {
      name: 'Documento',
      selector: 'document',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'Fecha',
      selector: 'createdAt',
      sortable: true,
      minWidth: '150px'
    },
    {
      name: 'Estado de la orden',
      selector: 'status',
      sortable: true,
      minWidth: '150px',
      cell: row => {
        return (
          <Badge color={status[row.status].color} pill>
            {status[row.status].title}
          </Badge>
        )
      }
    },
    {
      name: 'Acciones',
      allowOverflow: true,
      cell: row => (
        <ActionsComponent
          row={row}
          deleteRow={handleDelete}
        />
      )
    }
  ]

  const handleFilter = e => {
    const searchText = e.target.value
    setValue(searchText)
    let filterData = []
    if (searchText.length) {
      filterData = data.filter(item => {
        let startsWithCondition =
          item.client.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.email.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.patient_name.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.document.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.createdAt.toLowerCase().startsWith(searchText.toLowerCase())
        let includesCondition =
          item.client.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.patient_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.document.toLowerCase().includes(searchText.toLowerCase()) ||
          item.createdAt.toLowerCase().includes(searchText.toLowerCase())

        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      setFilteredData(filterData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Ordenes Creadas</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        subHeader
        subHeaderComponent={
          <CustomHeader value={value} handleFilter={handleFilter} />
        }
        pagination
        data={value ? filteredData : data}
        expandableRows
        columns={columns}
        expandOnRowClicked
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        expandableRowsComponent={<ExpandableTable handleStatus={handleStatus} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        // paginationComponent={CustomPagination}
      />
    </Card>
  )
}

export default OrderManagement
