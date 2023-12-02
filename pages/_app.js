import 'bootstrap/dist/css/bootstrap.min.css'
import styles from "../styles/globals.css"


function MyApp({ Component, pageProps }) {
  return (
      <div>
        <Component {...pageProps} />
      </div>
  )
}

export default MyApp
