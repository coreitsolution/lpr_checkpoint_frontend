import Swal, { SweetAlertIcon } from 'sweetalert2'

export default function PopupMessage(title: string, text: string, icon: SweetAlertIcon) {
  return (
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: false,
      showCloseButton: true,
    })
  )
}