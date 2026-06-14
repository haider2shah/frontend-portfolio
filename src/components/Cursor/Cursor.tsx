import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const startTarget = document.querySelector('[data-cursor="san-francisco"]')
    const startRect = startTarget?.getBoundingClientRect()
    let mx = startRect ? startRect.left + startRect.width / 2 : window.innerWidth / 2
    let my = startRect ? startRect.top + startRect.height / 2 : window.innerHeight / 2
    let rx = mx
    let ry = my
    let rafId: number

    if (startRect) {
      document.body.classList.add('cur-sf')
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
    }

    const onMove = (e: MouseEvent) => {
      document.body.classList.add('cur-active')
      mx = e.clientX
      my = e.clientY
      const target = e.target as Element
      if (target.closest('[data-cursor="san-francisco"]')) {
        document.body.classList.add('cur-sf')
      } else {
        document.body.classList.remove('cur-sf')
      }
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }

    const tick = () => {
      rx += (mx - rx) * 0.2
      ry += (my - ry) * 0.2
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      rafId = requestAnimationFrame(tick)
    }

    const linkSel = 'a,button,[role="button"],input,textarea,select'

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('[data-cursor="san-francisco"]')) document.body.classList.add('cur-sf')
      else if (target.closest('[data-card]')) document.body.classList.add('cur-view')
      else if (target.closest(linkSel)) document.body.classList.add('cur-link')
    }

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('[data-cursor="san-francisco"]')) document.body.classList.remove('cur-sf')
      if (target.closest('[data-card]')) document.body.classList.remove('cur-view')
      if (target.closest(linkSel)) document.body.classList.remove('cur-link')
    }

    const onDown = () => document.body.classList.add('cur-down')
    const onUp = () => document.body.classList.remove('cur-down')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId)
      document.body.classList.remove('cur-active', 'cur-sf', 'cur-view', 'cur-link', 'cur-down')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} aria-hidden="true" />
      <div ref={ringRef} className={styles.cursorRing} aria-hidden="true" />
    </>
  )
}
