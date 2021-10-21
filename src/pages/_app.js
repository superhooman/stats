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
  const [dateTouched, setDateTouched] = useState(false);
  const [date, setDate] = useState({
    from: moment().startOf('week').subtract(7, 'days').toDate(),
    to: moment().endOf('week').subtract(7, 'days').toDate(),
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
      dateTouched,
      setDate: (data) => {
        setDateTouched(true);
        setDate(data);
      },
    }}>
      {getLayout(<Component {...pageProps} />)}
    </GlobalContext.Provider>
  )
}

export default MyApp
