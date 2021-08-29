import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globals.css'
import GlobalContext from '../utils/globalContext';
import { useRouter } from 'next/router';
import moment from 'moment';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const getLayout = Component.getLayout || (page => page)
  const [user, setUser] = useState(null);
  const [date, setDate] = useState({
    from: moment().subtract(14, 'days').toDate(),
    to: moment().subtract(7, 'days').toDate(),
  })
  useEffect(() => {
    axios('/user/me').then((res) => {
      if (res.data.success) {
        setUser(res.data.user);
        if (router.pathname === '/login') {
          router.push('/dashboard/');
        }
      }
    }).catch((err) => {
      if (err.response && err.response.status !== 403) {
        alert("Ошибка сети");
      }
      if (router.pathname.indexOf('/dashboard') > -1) {
        router.push('/login');
      }
    });
  }, []);
  return (
    <GlobalContext.Provider value={{
      user,
      setUser,
      date,
      setDate,
    }}>
      {getLayout(<Component {...pageProps} />)}
    </GlobalContext.Provider>
  )
}

export default MyApp
