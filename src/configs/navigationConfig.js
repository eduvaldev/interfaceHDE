import React from "react"
import * as Icon from "react-feather"
import config from './config'

const navigationConfig = [
  {
    id: "home",
    title: "Panel de control",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: [config.role.admin, config.role.superAdmin, config.role.stuff],
    navLink: "/"
  },
  {
    id: "usermanagement",
    title: "Usuarios",
    type: "item",
    icon: <Icon.Settings size={20} />,
    permissions: [config.role.superAdmin, config.role.stuff],
    navLink: "/usermanagement"
  },
  {
    id: "upload_inventory",
    title: "Cargar inventario",
    type: "item",
    icon: <Icon.Briefcase size={20} />,
    permissions: [config.role.superAdmin, config.role.admin],
    navLink: "/upload_inventory"
  },
  {
    id: "order_management",
    title: "Lista de Ordenes",
    type: "item",
    icon: <Icon.Server size={20} />,
    permissions: [config.role.superAdmin, config.role.admin, config.role.stuff],
    navLink: "/order_management"
  },
  {
    id: "order",
    title: "Ordenes",
    type: "item",
    icon: <Icon.ShoppingCart size={20} />,
    permissions: [config.role.client],
    navLink: "/order"
  },
]

export default navigationConfig
