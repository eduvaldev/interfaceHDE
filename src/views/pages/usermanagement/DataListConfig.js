import React, { Component } from "react"
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button,
} from "reactstrap"
import DataTable from "react-data-table-component"
import classnames from "classnames"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import {
  Edit,
  Trash,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus
} from "react-feather"
import { connect } from "react-redux"
import {
  getUsers,
  deleteData,
  updateData,
  addData,
  addLog,
  filterData
} from "../../../redux/actions/usermanagement"
import Sidebar from "./DataListSidebar"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';

import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"
// import "../../../assets/scss/custom.scss"
import config from "../../../configs/config"

const chipColors = {
  live: "success",
  offline: "danger"
}

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important"
      }
    }
  }
}

function objArraySort(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

const formatGroupLabel = data => (
  <div className="d-flex justify-content-between align-center">
    <strong>
      {" "}
      <span>{data.label}</span>
    </strong>
    <span>{data.options.length}</span>
  </div>
)

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row)
        }}
      />
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

const CustomHeader = props => {

  return (
    <div className="data-list-header justify-content-between flex-wrap d-flex">
      <div className="actions-left d-flex flex-wrap">
        <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true, true)}
          outline>
          <Plus size={15} />
          <span className="align-middle">Agregar Usuario</span>
        </Button>
      </div>
      <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2 float-right">
        <UncontrolledDropdown className="data-list-rows-dropdown mr-1 d-md-block d-none">
          <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${props.index[0] || 0} - ${props.index[1] || 0} of ${props.total}`}
            </span>
            <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
              10
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(25)}>
              25
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(50)}>
              50
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(75)}>
              75
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  )
}

class DataListConfig extends Component {

  state = {
    data: [],
    // customers: [],
    // bodyarea: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: "Usuario",
        selector: "username",
        sortable: true,
        minWidth: '200px'
      },
      {
        name: "Correo Electrónico",
        selector: "email",
        sortable: true
      },
      {
        name: "Rol",
        selector: "role",
        sortable: true
      },
      {
        name: "Estado del Cliente",
        selector: "status",
        sortable: true,
      },
      {
        name: "Acciones",
        sortable: true,
        cell: row => (
          <ActionsComponent
            row={row}
            parsedFilter={this.props.parsedFilter}
            currentData={this.handleCurrentData}
            deleteRow={this.handleDelete}
          />
        )
      }
    ],
    allData: [],
    value: "",
    rowsPerPage: 10,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
    defaultAlert : false,
    confirmAlert : false,
    cancelAlert : false,
    onlyView: false,
    row: null,
  }


  static getDerivedStateFromProps(props, state) {
    if ((props.dataList.data && props.dataList.data.length !== state.data.length) || state.currentPage !== props.parsedFilter.page) {
      return {
        data: props.dataList.data,
        // customers: props.dataList.customers,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.totalPages,
        currentPage: parseInt(props.parsedFilter.page) - 1,
        rowsPerPage: parseInt(props.parsedFilter.perPage),
        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex
      }
    }

    // Return null if the state hasn't changed
    return null
  }

  thumbView = this.props.thumbView

  componentDidMount() {
    // if(Object.keys(this.props.parsedFilter).length === 0)//empty object
    // {
    //   this.props.getUsers({page:this.props.parsedFilter.page1, perPage: 4});
    // }
    // else if (this.props.parsedFilter.page1 !== undefined)
    //   this.props.getUsers({page:this.props.parsedFilter.page1, perPage: 4});
    let { parsedFilter, getUsers, userinfo } = this.props
    if(userinfo.role === config.role.superAdmin)
      getUsers({ page: parsedFilter.page, perPage: 75 })
    else if(userinfo.role === config.role.stuff)
      getUsers({ page: parsedFilter.page, perPage: 75 }, userinfo.id)
  }

  handleFilter = e => {
    this.setState({ value: e.target.value })
    this.props.filterData(e.target.value)
  }

  handleRowsPerPage = value => {
    let { parsedFilter, getUsers, userinfo } = this.props
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
    history.push(`?page=${page}&perPage=${value}`)
    this.setState({ rowsPerPage: value })
    if(userinfo.role === config.role.superAdmin)
      getUsers({ page: parsedFilter.page, perPage: 75 })
    else if(userinfo.role === config.role.stuff)
      getUsers({ page: parsedFilter.page, perPage: 75 }, userinfo.id)
  }

  handleAlert = (state, value) => {
    this.setState({ [state] : value })
  }

  handleSidebar = (boolean, addNew) => {

    this.setState({ sidebar: boolean, onlyView: false })
    if (addNew === true) {
      this.setState({ currentData: null, addNew: true })
    }
  }

  handleDelete = row => {
    if(row.role == config.role.superAdmin){
      toast.warning('No puede borrar el super admin.')
      return
    }
    this.setState({
      defaultAlert: true,
      row: row
    });
  }

  handleAddLog = (target_user, target_user_role) => {
    this.props.addLog({viewer: this.props.userinfo.username, viewer_role: this.props.userinfo.role, target_user, target_user_role});
  }

  deleteSession = async (row) => {
    await this.props.deleteData(row)
    if(this.props.userinfo.role === config.role.superAdmin){
      this.props.getUsers({
        page: this.props.parsedFilter.page - 1,
        perPage: this.props.parsedFilter.perPage
      })
    }
    else if(this.props.userinfo.role === config.role.stuff){
      this.props.getUsers({
        page: this.props.parsedFilter.page - 1,
        perPage: this.props.parsedFilter.perPage
      }, this.props.userinfo.id)
    }

  }

  handleCurrentData = async obj => {
    this.setState({ currentData: obj, addNew: false, onlyView: false })
    this.handleSidebar(true)
  }

  handleRowChange = row => {
    this.setState({sidebar: true, onlyView: true, currentData: row, addNew: false});
  }

  handlePagination = page => {
    let { parsedFilter, getUsers, userinfo } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
    let urlPrefix = this.props.thumbView
      ? ""
      : ""
    history.push(
      `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`
    )
    if(userinfo.role === config.role.superAdmin){
      getUsers({ page: page.selected + 1, perPage: perPage })
    }
    else if(userinfo.role === config.role.stuff){
      getUsers({ page: page.selected + 1, perPage: perPage }, userinfo.id)
    }

    this.setState({ currentPage: page.selected })
  }

  render() {
    let {
      columns,
      data,
      customers,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex
    } = this.state

    return (

      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}>
        <CustomHeader
          handleSidebar={this.handleSidebar}
          handleFilter={this.handleFilter}
          handleRowsPerPage={this.handleRowsPerPage}
          rowsPerPage={rowsPerPage}
          total={totalRecords}
          index={sortIndex}
          customers={customers}
        />
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          noDataComponent={(<div style={{padding: "24px"}}>Por favor, seleccione un cliente de la barra de búsqueda para mostrar su historial / registros</div>)}
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={data =>
            this.setState({ selected: data.selectedRows })
          }
          onRowClicked={row => this.handleRowChange(row)}
          customStyles={selectedStyle}
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm"
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          addLog={this.handleAddLog}
          handleSidebar={this.handleSidebar}
          handleStopStreaming={this.props.stopStreaming}
          thumbView={this.props.thumbView}
          getUsers={this.props.getUsers}
          sendNote={this.props.sendNote}
          userinfo={this.props.userinfo}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
          bodyarea={this.state.bodyarea||[]}
          onlyView={this.state.onlyView}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
        <SweetAlert title="Esta seguro?"
            warning
            show={this.state.defaultAlert}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Si, De acuerdo!"
            cancelBtnText="Cancelar"
            onConfirm={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("defaultAlert", false)
              this.handleAlert("confirmAlert", true)
              this.deleteSession(this.state.row);
            }}
            onCancel={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("defaultAlert", false)
            }}
          >
            De borrar el usuario no se podran desaser los cambios.
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.users,
    userinfo: state.auth.userinfo
  }
}

export default connect(mapStateToProps, {
  getUsers,
  deleteData,
  updateData,
  addData,
  addLog,
  filterData
})(DataListConfig)
