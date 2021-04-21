import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import OrderReports from "./order-management/order-reports";
import InventoryReports from "./upload_inventory/ReportInventory";
import { useSelector } from 'react-redux'
import config from "../../configs/config";
import { history } from "../../history";

const Home = () => {
  const user = useSelector(state=> state.auth.userinfo)

  if (user.role === config.role.client) {
    history.push('/order')
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes</CardTitle>
      </CardHeader>
      <CardBody>
        <OrderReports />
        <InventoryReports />
      </CardBody>
    </Card>
  )
}

export default Home
