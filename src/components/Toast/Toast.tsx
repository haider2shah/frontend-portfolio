import styles from './Toast.module.css'
import { CheckIcon } from '../../icons/Icons'

interface ToastProps {
  visible: boolean
  message?: string
}

export default function Toast({ visible, message = 'Email copied' }: ToastProps) {
  return (
    <div
      className={`${styles.toast} ${visible ? styles.show : ''}`}
      role="status"
      aria-live="polite"
    >
      <CheckIcon size={14} />
      {message}
    </div>
  )
}
