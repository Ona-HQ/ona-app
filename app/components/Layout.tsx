import { Header } from './Header'

export function Layout({ authenticated, children }) {
  return (
    <>
      {authenticated ? (
        <div className="relative bg-phantom">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                <span className="md:hidden"> Welcome to Alpha Devnet! </span>
                <span className="hidden md:inline"> Thanks for trying Ona! This is an alpha version (read: has bugs) and might be reset regularly! </span>
                <span className="block sm:ml-2 sm:inline-block">
                  <a href="https://docs.ona.so" target="_blank" className="text-white font-bold underline"> Learn more <span aria-hidden="true">&rarr;</span></a>
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <Header authenticated={authenticated} />
      {children}
    </>
  )
}
