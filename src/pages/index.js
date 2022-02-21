import { useContext, useEffect, useState } from 'react';
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import { ru } from 'date-fns/locale'
import { CalendarIcon, DownloadIcon } from "@heroicons/react/outline";
import moment from "moment"
import Link from "next/link"
import Layout from '../components/layout';
import Select from '../components/select';
import Loader from '../components/loader';
import GlobalContext from '../utils/globalContext';
import Modal, { Title as ModalTitle, Actions as ModalActions } from "../components/modal";
import Button from '../components/button'
import { format } from 'date-fns';

import 'moment/locale/ru';

const currentYear = new Date().getFullYear() - 1;
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths('ru');

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <div className="grid grid-cols-7 gap-3">
        <Select className="col-span-4" options={months.map((month, i) => ({
          label: month,
          value: i
        }))} name="month" onChange={handleChange} value={date.getMonth()} />
        <Select className="col-span-3" options={years.map((year) => ({
          label: year,
          value: year
        }))} name="year" onChange={handleChange} value={date.getFullYear()} />
      </div>
    </form>
  );
}


const INITIAL_STATE = {
  isLoading: true,
  data: {
    security: {
      week: 0,
      month: 0,
      year: 0,
    },
    accidents: {
      weekMain: 0,
      weekChild: 0,
      monthMain: 0,
      monthChild: 0,
      yearMain: 0,
      yearChild: 0,
    },
    work: {
      week: 0,
      month: 0,
      year: 0
    },
    failures: {
      weekMain: 0,
      weekChild: 0,
      monthMain: 0,
      monthChild: 0,
      yearMain: 0,
      yearChild: 0,
    },
    pollution: {
      week: 0,
      month: 0,
      year: 0,
    },
    med: {
      week: 0,
      month: 0,
      year: 0,
    },
    check: {
      week: 0,
      month: 0,
      year: 0,
    },
    edu: {
      week: 0,
      month: 0,
      year: 0,
    },
    incidents: {
      week: 0,
      month: 0,
      year: 0,
    }
  }
}

const CardTitle = ({ children }) => (
  <div className="py-3 px-4 text-green-400 text-opacity-90 border-b border-gray-600 text-base text-center leading-tight">
    {children}
  </div>
)

const Card = ({ href = "", children, className = "" }) => (
  <Link href={`/data/${href}`}>
    <div className={`bg-gray-800 rounded-lg border-gray-600 border ${className}`}>
      {children}
    </div>
  </Link>
)

const Detail = ({ title, value }) => (
  <div className="py-2 px-4">
    <div className="text-white text-opacity-60 font-medium uppercase text-xs">{title}</div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
)

const Home = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const { date, setDate } = useContext(GlobalContext);
  const [month, setMonth] = useState(date.to);

  const [modal, setModal] = useState(false);

  const handleDayClick = (day) => {
    if (moment(day).isAfter(moment())) {
      return
    }
    const range = DateUtils.addDayToRange(day, date);
    setDate(range);
  };

  useEffect(() => {
    if (!date.from || !date.to) {
      return;
    }
    fetch(`/data?from=${date.from.toISOString()}&to=${date.to.toISOString()}`).then((res) => res.json()).then((json) => {
      if (json.success) {
        setState({
          isLoading: false,
          data: json.data
        })
      }
    })
  }, [date]);

  if (state.isLoading) {
    return <Loader />
  } else {
    return (
      <div>
        <div className="pb-4 flex items-center border-b border-gray-600">
          <Button onClick={() => setModal(true)} icon={<CalendarIcon />} />
          <div className="font-bold text-lg mx-4 flex-1">Главный экран</div>
          <Button disabled icon={<DownloadIcon />} />
        </div>
        <div className="py-4">
          <div className="text-sm p-4 rounded-lg bg-gray-800 w-min whitespace-nowrap">Показаны данные с <b>{date.from ? format(date.from, 'd LLL y', { locale: ru }) : ''}</b> по <b>{date.to ? format(date.to, 'd LLL y', { locale: ru }) : ''}</b></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <Card href="check" className="flex flex-col h-full">
            <CardTitle>Кол-во проверок по промышленной, пожарной безопасности и ООС</CardTitle>
            <div className="divide-y divide-gray-600 h-full flex flex-col justify-around">
              <Detail title="За прошедшую неделю" value={state.data.check.week} />
              <Detail title="С начала месяца" value={state.data.check.month} />
              <Detail title="С начала года" value={state.data.check.year} />
            </div>
          </Card>
          <Card href="accidents">
            <CardTitle>Кол-во несчастных случаев в компании/подрядных организациях</CardTitle>
            <div className="text-white text-opacity-40 flex justify-between text-xs py-1 px-4 border-b border-gray-600 uppercase font-medium">
              <span>Комания</span>
              <span>Подрядные орг.</span>
            </div>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={(
                <div className="flex justify-between">
                  <span>{state.data.accidents.weekMain}</span>
                  <span>{state.data.accidents.weekChild}</span>
                </div>
              )} />
              <Detail title="С начала месяца" value={(
                <div className="flex justify-between">
                  <span>{state.data.accidents.monthMain}</span>
                  <span>{state.data.accidents.monthChild}</span>
                </div>
              )} />
              <Detail title="С начала года" value={(
                <div className="flex justify-between">
                  <span>{state.data.accidents.yearMain}</span>
                  <span>{state.data.accidents.yearChild}</span>
                </div>
              )} />
            </div>
          </Card>
          <Card href="failures">
            <CardTitle>Кол-во аварий/пожаров в компании/подрядных организациях</CardTitle>
            <div className="text-white text-opacity-40 flex justify-between text-xs py-1 px-4 border-b border-gray-600 uppercase font-medium">
              <span>Комания</span>
              <span>Подрядные орг.</span>
            </div>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={(
                <div className="flex justify-between">
                  <span>{state.data.failures.weekMain}</span>
                  <span>{state.data.failures.weekChild}</span>
                </div>
              )} />
              <Detail title="С начала месяца" value={(
                <div className="flex justify-between">
                  <span>{state.data.failures.monthMain}</span>
                  <span>{state.data.failures.monthChild}</span>
                </div>
              )} />
              <Detail title="С начала года" value={(
                <div className="flex justify-between">
                  <span>{state.data.failures.yearMain}</span>
                  <span>{state.data.failures.yearChild}</span>
                </div>
              )} />
            </div>
          </Card>
          <Card href="security">
            <CardTitle>Кол-во инцидентов по СБ</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.security.week} />
              <Detail title="С начала месяца" value={state.data.security.month} />
              <Detail title="С начала года" value={state.data.security.year} />
            </div>
          </Card>
          <Card href="work">
            <CardTitle>Были приостановлены работы</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.work.week} />
              <Detail title="С начала месяца" value={state.data.work.month} />
              <Detail title="С начала года" value={state.data.work.year} />
            </div>
          </Card>
          <Card href="pollution">
            <CardTitle>Загрязнение окружающей среды</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.pollution.week} />
              <Detail title="С начала месяца" value={state.data.pollution.month} />
              <Detail title="С начала года" value={state.data.pollution.year} />
            </div>
          </Card>
          <Card href="med">
            <CardTitle>Кол-во медицинских эвакуаций</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.med.week} />
              <Detail title="С начала месяца" value={state.data.med.month} />
              <Detail title="С начала года" value={state.data.med.year} />
            </div>
          </Card>
          <Card href="edu">
            <CardTitle>Проведено обучений</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.edu.week} />
              <Detail title="С начала месяца" value={state.data.edu.month} />
              <Detail title="С начала года" value={state.data.edu.year} />
            </div>
          </Card>
          <Card href="incidents">
            <CardTitle>Кол-во инцидентов</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За прошедшую неделю" value={state.data.incidents.week} />
              <Detail title="С начала месяца" value={state.data.incidents.month} />
              <Detail title="С начала года" value={state.data.incidents.year} />
            </div>
          </Card>
        </div>
        <Modal open={modal} close={() => setModal(false)}>
          <ModalTitle>Фильтрация по дате</ModalTitle>
          <DayPicker
            localeUtils={MomentLocaleUtils}
            month={month}
            fromMonth={fromMonth}
            toMonth={toMonth}
            locale="ru"
            className={`Selectable oneMonth`}
            numberOfMonths={1}
            disabledDays={[{ after: new Date() }]}
            selectedDays={[date.from, date]}
            modifiers={{ start: date.from, end: date.to }}
            onDayClick={handleDayClick}
            captionElement={({ date, localeUtils }) => (
              <YearMonthForm
                date={date}
                localeUtils={localeUtils}
                onChange={setMonth}
              />
            )}
          />
          <ModalActions>
          <Button onClick={() => {
              setDate({
                from: moment().startOf('week').subtract(7, 'days').toDate(),
                to: moment().endOf('week').subtract(7, 'days').toDate(),
              })
          }}>Сброс</Button>
            <Button onClick={() => setModal(false)} >Закрыть</Button>
          </ModalActions>
        </Modal>
      </div>
    )
  }
}

Home.getLayout = page => (
  <Layout>
    {page}
  </Layout>
)

export default Home;