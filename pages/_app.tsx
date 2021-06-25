import '../styles/globals.css'
import NavBar from './../components/NavBar'
import Loader from './../components/Loader'

import {Toaster} from 'react-hot-toast'
import {UserContext} from '../lib/context'
import EnterPage from './enter'
import {useUserData} from '../lib/hooks'

function MyApp({ Component, pageProps }) {

  const userData = useUserData();

//   useEffect(()=>{      
//     if(!loading) {
//          ((userinfo==null)?
//           /*API call A (When user is not logged in) */ :
//          /*API call B (When user is logged in) */
//          )
//     }
//  )},[loading, userinfo])  

// if(loading) return <Loader />
  return (<UserContext.Provider value={userData}>
  <NavBar></NavBar>
  <Component {...pageProps} />
  <Toaster></Toaster>
  {/* <EnterPage /> */}
  </UserContext.Provider>);
}

export default MyApp
