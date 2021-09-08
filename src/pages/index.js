import { useContext, useEffect, useState } from 'react';
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import { ru } from 'date-fns/locale'
import { CalendarIcon, DownloadIcon } from "@heroicons/react/outline";
import moment from "moment"
import Link from "next/link"
import Layout from '../components/layout';
import Loader from '../components/loader';
import GlobalContext from '../utils/globalContext';
import Modal, { Title as ModalTitle, Actions as ModalActions } from "../components/modal";
import Button from '../components/button'
import { format } from 'date-fns';

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    if (i === 6) {
      days.push(
        moment(weekStart)
          .add(i, 'days')
          .endOf('day')
          .toDate()
      );
    } else {
      days.push(
        moment(weekStart)
          .add(i, 'days')
          .toDate()
      );
    }

  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date)
      .startOf('isoWeek')
      .toDate(),
    to: moment(date)
      .endOf('isoWeek')
      .toDate(),
  };
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
  const [selectedDays, setSelectedDays] = useState(getWeekRange(date));
  const [hoverRange, setHoverRange] = useState(undefined);

  const [modal, setModal] = useState(false);

  const handleDayChange = date => {
    const days = getWeekDays(getWeekRange(date).from);
    setSelectedDays(days);
    console.log(days)
    setDate({
      from: days[0],
      to: days[6],
    })
  };

  const handleDayEnter = date => {
    setHoverRange(getWeekRange(date));
  };

  const handleDayLeave = () => {
    setHoverRange(undefined);
  };

  const handleWeekClick = (weekNumber, days, e) => {
    setSelectedDays(days);
  };

  useEffect(() => {
    fetch(`/data?from=${date.from.toISOString()}&to=${date.to.toISOString()}`).then((res) => res.json()).then((json) => {
      if (json.success) {
        setState({
          isLoading: false,
          data: json.data
        })
      }
    })
  }, [date]);

  const daysAreSelected = selectedDays.length > 0;

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  };


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
          <div className="text-sm p-4 rounded-lg bg-gray-800 w-min whitespace-nowrap">Показаны данные с <b>{format(date.from, 'd LLL y', { locale: ru })}</b> по <b>{format(date.to, 'd LLL y', { locale: ru })}</b></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <Card href="check" className="flex flex-col h-full">
            <CardTitle>Кол-во проверок по промышленной, пожарной безопасности и ООС</CardTitle>
            <div className="divide-y divide-gray-600 h-full flex flex-col justify-around">
              <Detail title="За неделю" value={state.data.check.week} />
              <Detail title="За месяц" value={state.data.check.month} />
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
              <Detail title="За неделю" value={(
                <div className="flex justify-between">
                  <span>{state.data.accidents.weekMain}</span>
                  <span>{state.data.accidents.weekChild}</span>
                </div>
              )} />
              <Detail title="За месяц" value={(
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
              <Detail title="За неделю" value={(
                <div className="flex justify-between">
                  <span>{state.data.failures.weekMain}</span>
                  <span>{state.data.failures.weekChild}</span>
                </div>
              )} />
              <Detail title="За месяц" value={(
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
              <Detail title="За неделю" value={state.data.security.week} />
              <Detail title="За месяц" value={state.data.security.month} />
              <Detail title="С начала года" value={state.data.security.year} />
            </div>
          </Card>
          <Card href="work">
            <CardTitle>Были приостановлены работы</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За неделю" value={state.data.work.week} />
              <Detail title="За месяц" value={state.data.work.month} />
              <Detail title="С начала года" value={state.data.work.year} />
            </div>
          </Card>
          <Card href="pollution">
            <CardTitle>Загрязнение окружающей среды</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За неделю" value={state.data.pollution.week} />
              <Detail title="За месяц" value={state.data.pollution.month} />
              <Detail title="С начала года" value={state.data.pollution.year} />
            </div>
          </Card>
          <Card href="med">
            <CardTitle>Кол-во медицинских эвакуаций</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За неделю" value={state.data.med.week} />
              <Detail title="За месяц" value={state.data.med.month} />
              <Detail title="С начала года" value={state.data.med.year} />
            </div>
          </Card>
          <Card href="edu">
            <CardTitle>Проведено обучений</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За неделю" value={state.data.edu.week} />
              <Detail title="За месяц" value={state.data.edu.month} />
              <Detail title="С начала года" value={state.data.edu.year} />
            </div>
          </Card>
          <Card href="incidents">
            <CardTitle>Кол-во инцидентов</CardTitle>
            <div className="divide-y divide-gray-600">
              <Detail title="За неделю" value={state.data.incidents.week} />
              <Detail title="За месяц" value={state.data.incidents.month} />
              <Detail title="С начала года" value={state.data.incidents.year} />
            </div>
          </Card>
        </div>
        <Modal open={modal} close={() => setModal(false)}>
          <ModalTitle>Фильтрация по дате</ModalTitle>
          <div className="SelectedWeekExample">
            <DayPicker
              localeUtils={MomentLocaleUtils}
              locale="ru"
              firstDayOfWeek={1}
              className={`Selectable oneMonth`}
              numberOfMonths={1}
              selectedDays={selectedDays}
              showOutsideDays
              modifiers={modifiers}
              onDayClick={handleDayChange}
              onDayMouseEnter={handleDayEnter}
              onDayMouseLeave={handleDayLeave}
              onWeekClick={handleWeekClick}
            />
          </div>
          <ModalActions>
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