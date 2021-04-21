import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const alert = withReactContent(Swal)

export const alertSuccess = (title, text) => {
  return alert.fire({
    title: title,
    text: text,
    icon: 'success',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  })
}

export const alertInfo = (title, text) => {
  return alert.fire({
    title: title,
    text: text,
    icon: 'info',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  })
}

export const alertWarning = (title, text) => {
  return alert.fire({
    title: title,
    text: text,
    icon: 'warning',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  })
}

export const alertError = (title, text) => {
  return alert.fire({
    title: title,
    text: text,
    icon: 'error',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  })
}
