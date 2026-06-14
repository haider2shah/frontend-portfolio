export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const element = document.getElementById(id)
  if (!element) return

  element.scrollIntoView({ behavior, block: 'start' })
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

export function handleSectionClick(id: string) {
  return (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    scrollToSection(id)
  }
}

export function handleSkipToMain(event: React.MouseEvent<HTMLElement>) {
  event.preventDefault()
  const main = document.getElementById('main')
  if (!main) return

  main.setAttribute('tabindex', '-1')
  main.focus({ preventScroll: true })
  main.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

export function goHomeThenScroll(id: string) {
  window.sessionStorage.setItem('pendingScrollSection', id)
  window.location.assign('/')
}

export function consumePendingScroll() {
  const id = window.sessionStorage.getItem('pendingScrollSection')
  if (!id) return false

  window.sessionStorage.removeItem('pendingScrollSection')
  window.requestAnimationFrame(() => scrollToSection(id))
  return true
}
