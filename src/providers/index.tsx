import { FC } from "react"
import IntlProvider from "./IntlProvider"

const Providers:FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <IntlProvider>{children}</IntlProvider>
  )
}

export default Providers