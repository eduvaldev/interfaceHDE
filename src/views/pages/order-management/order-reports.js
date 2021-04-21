import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  ChevronDown,
  Trash,
  Search
} from 'react-feather';
import DataTable from 'react-data-table-component';
import {
  Card,
  CardHeader,
  CardTitle,
  Input
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { ViewOrderItem } from '../order/ViewOrderItem';
import {
  getOrders,
  deleteData
} from "../../../redux/actions/order";
import { alert } from "../../../components/alert";
import config from '../../../configs/config';
import ExportCSV from '../../../components/export-csv';

const ExpandableTable = ({ data }) => {
  console.log("Data: ", data)
  return (
    <ViewOrderItem item={data} />
  )
}

const CustomHeader = props => {
  return (
    <div className="d-flex justify-content-between w-100 mt-1">
      <div className="position-relative has-icon-left mb-1">
        <Input value={props.value} onChange={e => props.handleFilter(e)} placeholder="Buscar..." />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
      <ExportCSV csvData={props.csvData} filename={`OrderReport-${Date.now()}.csv`} />
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

const OrderReports = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [picker, setPicker] = useState(new Date())
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state=> state.auth.userinfo)
  useEffect(()=> {
    dispatch(getOrders(user, picker.getTime()))
  }, [user, picker])

  const dbData = useSelector(state => state.order.allData) || []
  if (user.role == config.role.client)
    return null
  const csvData = []
  const header = ['Doctores', 'Correo Electrónico', 'Paciente', 'Documento', 'Fecha']
  csvData.push(header)
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
    orderItem._id = item._id
    orderItem.id = idx

    csvData.push([orderItem.client, orderItem.email, orderItem.patient_name, orderItem.document, orderItem.createdAt])
    return orderItem
  })
  const handleDelete = (item) => {
    return alert.fire({
      title: 'Esta Seguro?',
      text: "Si acepta no puede remover cambios",
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
          icon: 'Confirmada',
          title: 'Removido!',
          text: 'El usuario ha sido removido.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        dispatch(getOrders(user))
      }
    })
  }

  const columns = [
    {
      name: 'Doctores',
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
        <CardTitle tag='h4'>Órdenes creadas</CardTitle>
        <div className="d-flex">
          <Flatpickr 
            className='form-control' 
            value={picker} 
            onChange={date => setPicker(date[0])} 
            id='default-picker' 
          />
        </div>
      </CardHeader>
      <DataTable
        noHeader
        subHeader
        subHeaderComponent={
          <CustomHeader 
            value={value} 
            handleFilter={handleFilter} 
            picker={picker} 
            setPicker={setPicker} 
            csvData={csvData}
          />
        }
        pagination
        data={value ? filteredData : data}
        expandableRows
        columns={columns}
        expandOnRowClicked
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        expandableRowsComponent={<ExpandableTable />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        // paginationComponent={CustomPagination}
      />
    </Card>
  )
}

export default OrderReports
