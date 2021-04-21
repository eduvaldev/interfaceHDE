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
  Badge
} from 'reactstrap'
import "flatpickr/dist/themes/light.css"
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import config from '../../../configs/config'
import ExportCSV from '../../../components/export-csv'

const status = [
  {color: "success", text: "Origen"},
  {color: "warning", text: "aceptado"},
  {color: "danger", text: "rechazado"}
]

const CustomHeader = props => {
  return (
    <div className="d-flex justify-content-between w-100 mt-1">
      <div className="position-relative has-icon-left mb-1 ">
        <Input value={props.value} onChange={e => props.handleFilter(e)} placeholder="Buscar en el inventario..." />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
      <ExportCSV csvData={props.csvData} filename={`InventoryRotation-${Date.now()}.csv`} />
    </div>
  )
}

const InventoryReports = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [picker, setPicker] = useState(new Date())
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state=> state.auth.userinfo)

  // useEffect(()=> {
  //   dispatch(getOrders(user, picker.getTime()))
  // }, [user, picker])

  const dbData = useSelector(state => state.order.allData) || []
  if (user.role == config.role.client)
    return null
  let data = []
  const csvData = []
  csvData.push(['Doctor', 'Correo Electrónico', 'Referencia', 'Descripcion', 'Qty', 'Remaining', 'Status'])
  let id = Date.now()
  dbData.map((item, idx) => {

    const tmp1 = item.implants.map(imp => {
      const inventoryItem = {}
      inventoryItem.client = item.client.username
      inventoryItem.email = item.client.email
      inventoryItem.referencia = imp.referencia
      inventoryItem.descripcion = imp.Descripcion
      inventoryItem.qty = imp?.qty
      inventoryItem.cantidad = imp.implant?.cantidad
      inventoryItem.status = imp?.isReplacement ? 1 : 0
      inventoryItem.isRejected = false
      inventoryItem.id = id++

      csvData.push([inventoryItem.client, inventoryItem.email, inventoryItem.referencia, inventoryItem.descripcion, inventoryItem.qty, inventoryItem.cantidad, status[inventoryItem.status].text])
      return inventoryItem
    })

    const tmp2 = item.rejectedImplants.map(imp => {
      const inventoryItem = {}
      inventoryItem.client = item.client.username
      inventoryItem.email = item.client.email
      inventoryItem.referencia = imp.referencia
      inventoryItem.descripcion = imp.descripcion
      inventoryItem.qty = '-'
      inventoryItem.cantidad = imp.implant.cantidad
      inventoryItem.status = 2
      inventoryItem.id = id++

      csvData.push([inventoryItem.client, inventoryItem.email, inventoryItem.referencia, inventoryItem.descripcion, inventoryItem.qty, inventoryItem.cantidad, status[inventoryItem.status].text])
      return inventoryItem
    })
    data = data.concat(tmp1, tmp2)
  })

  const columns = [
    {
      name: 'Doctor',
      selector: 'client',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'Correo Electrónico',
      selector: 'email',
      sortable: true,
      minWidth: '120px'
    },
    {
      name: 'Referencia',
      selector: 'referencia',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'Descripcion',
      selector: 'descripcion',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Cantidad',
      selector: 'qty',
      sortable: true,
      minWidth: '50px'
    },
    {
      name: 'Sobrantes',
      selector: 'cantidad',
      sortable: true,
      minWidth: '50px'
    },
    {
      name: 'Estado',
      selector: 'status',
      sortable: true,
      minWidth: '150px',
      cell: row => {
        return (
          <Badge color={status[row.status].color} pill>
            {status[row.status].text}
          </Badge>
        )
      }
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
          item.referencia.toLowerCase().startsWith(searchText.toLowerCase()) ||
          item.descripcion.toLowerCase().startsWith(searchText.toLowerCase()) ||
          status[item.status].text.startsWith(searchText.toLowerCase())
        let includesCondition =
          item.client.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.referencia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
          status[item.status].text.toLowerCase().includes(searchText.toLowerCase())

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
        <CardTitle tag='h4'>Rotacion del Inventario</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        subHeader
        subHeaderComponent={
          <CustomHeader value={value} handleFilter={handleFilter} picker={picker} setPicker={setPicker} csvData={csvData} />
        }
        pagination
        data={value ? filteredData : data}
        columns={columns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        // paginationComponent={CustomPagination}
      />
    </Card>
  )
}

export default InventoryReports
