import moment from 'moment';
import { createContext } from 'react';

const GlobalContext = createContext({
  user: null,
  setUser: () => {},
  date: {
    from: moment().startOf('week').subtract(6, 'days').toDate(),
    to: moment().endOf('week').subtract(6, 'days').toDate(),
  },
  setDate: () => {},
});

export default GlobalContext;
