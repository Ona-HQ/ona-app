import { Header } from './Header'

export function Layout({ authenticated, children }) {
  return (
    <>
      <Header authenticated={authenticated} />
      {children}
    </>
  )
}
