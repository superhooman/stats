import moment from 'moment';
import { createContext } from 'react';

const GlobalContext = createContext({
  user: null,
  setUser: () => {},
  date: {
    from: moment().subtract(14, 'days').toDate(),
    to: moment().subtract(7, 'days').toDate(),
  },
  setDate: () => {},
});

export default GlobalContext;
