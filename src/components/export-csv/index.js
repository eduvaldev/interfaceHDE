import React from 'react'
import { CSVLink } from 'react-csv'

const ExportCSV = (props) => {

  return <CSVLink data={props.csvData} filename={props.filename} className="btn btn-success d-flex align-items-center" >Exportar a CSV</CSVLink>
}

export default ExportCSV
