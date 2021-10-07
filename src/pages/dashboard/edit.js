import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import moment from "moment"
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import Button from '../../components/button';
import Select from '../../components/select';
import Input from '../../components/input';
import { Title as ModalTitle, Actions as ModalActions } from '../../components/modal';
import axios from 'axios';

import 'moment/locale/ru';
import Loader from '../../components/loader';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrashIcon } from '@heroicons/react/outline';

const getDate = () => {
  return {
    from: moment().subtract(30, 'days').toDate(),
    to: moment().toDate(),
  }
}

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

const Modal = dynamic(() => import('../../components/modal'), {
  ssr: false
})

const types = {
  security: 'Количество инцидентов по СБ на нефтепромыслах, ед',
  accidents: 'Количество несчастных случаев, связанных с трудовой деятельностью ',
  failures: 'Количество аварий, пожаров',
  incidents: 'Количество инцидентов',
  pollution: 'Загрязнение окружающей среды',
  pnb: 'Количество проведенных ПНБ',
  directions: 'Количество выданных указаний',
  check: 'Количество проверок',
  control: 'Контроль за выполнением работ',
  edu: 'Проведено обучений работников по запланированным программам',
  train: 'Проведено учебно-тренировочных занятий с пожарными расчетами',
  meeting: 'Проведено собраний совещаний по безопасности',
  auto: 'Проверено автотранспорта и спецтехники',
  gazovoz: 'Проверено автогазовозов',
  work: 'Были приостановлены работы по причине нарушений безопасности',
  med: 'Количество медицинских эвакуаций по болезни работников'
}

const Edit = () => {
  const [date, setDate] = useState(getDate());
  const [type, setType] = useState('security');
  const [month, setMonth] = useState(date.to);
  const [modal, setModal] = useState(false);
  const [state, setState] = useState({
    isLoading: true,
    data: {
      items: []
    }
  });

  const [edit, setEdit] = useState({
    id: '',
    value: 0,
    notes: [],
    open: false,
  })

  const handleDayClick = (day) => {
    if (moment(day).isAfter(moment())) {
      return
    }
    const range = DateUtils.addDayToRange(day, date);
    setDate(range);
  };

  const getData = () => {
    fetch(`/data/key?key=${type}&dateStart=${date.from.toISOString().split('T')[0]}&dateEnd=${date.to.toISOString().split('T')[0]}`)
      .then((res) => res.json())
      .then((json) => {
        setState({
          isLoading: false,
          data: {
            items: json.records
          }
        })
      })
  }

  const submit = () => {
    axios({
      url: `/data/edit/${edit.id}`,
      method: "POST",
      data: {
        value: edit.value,
        notes: edit.notes,
      }
    }).then((res) => {
      if (res.data && res.data.success) {
        setEdit({
          id: '',
          value: 0,
          notes: [],
          open: false,
        });
        alert("Сохранено");
        getData();
      }
    })
  }

  useEffect(() => {
    setState({
      isLoading: true,
      data: {
        items: []
      }
    })
    getData();
  }, [type, date]);

  const onRemove = (id) => {
    const sure = confirm('Вы уверены?');
    if (!sure) {
      return;
    }
    axios({
      url: `/data/remove/${id}`,
      method: "DELETE",
    }).then(() => {
      getData();
    })
  }

  return (
    <div className="max-w-xl py-8 px-4 mx-auto">
      <h1 className="text-xl font-semibold">Редактирование данных</h1>
      <div className="grid grid-cols-1 gap-6 py-6">
        <Select
          label="Тип"
          withLabel
          value={type}
          onChange={({ target }) => {
            setType(target.value);
          }}
          options={Object.keys(types).map((type) => (
            {
              label: types[type],
              value: type
            }
          ))}
        />
        <Button className="w-full" onClick={() => setModal(true)}>Даты: {moment(date.from).format("DD.MM.YYYY")} - {moment(date.to).format("DD.MM.YYYY")}</Button>
      </div>
      {state.isLoading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-8">
          {state.data.items.map((record) => (
            <div className="bg-gray-700 rounded-xl p-4" key={record._id}>
              <h2 className="font-bold text-lg">{moment(new Date(record.date)).format('DD.MM.YYYY')}</h2>
              <div><b>Кол-во: </b>{record.value}</div>
              {record.notes.length ? (
                <div>
                  <b>Описание:</b><br />
                  {record.notes.map((line, i) => (
                    <div key={`${record._id}-${i}`}>{line}</div>
                  ))}
                </div>
              ) : null}
              <Button onClick={() => {
                setEdit({
                  id: record._id,
                  value: record.value,
                  notes: record.notes,
                  open: true
                })
              }} className="w-full mt-2">Редактировать</Button>
              <Button onClick={() => {
                onRemove(record._id);
              }} className="w-full mt-2">Удалить</Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={edit.open} close={() => setEdit(prev => ({ ...prev, open: false }))}>
        <ModalTitle>Редактировать</ModalTitle>
        <Input withLabel label="Кол-во" min={0} type="number" value={edit.value} onChange={(e) => {
          const { value } = e.target;
          setEdit(prev => ({ ...prev, value: Number(value) }))
        }} />
        <span className="block text-gray-300 text-sm font-medium mt-4 mb-1">Описание</span>
        <div className="grid-cols-1 grid gap-6">
          {edit.notes.map((note, i) => (
            <div className="flex items-center">
              <div className="flex-grow">
                <Input type="text" value={note} key={`note-${i}`} onChange={(e) => {
                  const { value } = e.target;
                  const arr = [...edit.notes];
                  arr[i] = value;
                  setEdit(prev => ({ ...prev, notes: arr }));
                }} />
              </div>
              {i > 0 ? <Button onClick={() => {
                const arr = [...edit.notes];
                arr.splice(i, 1);
                setEdit(prev => ({ ...prev, notes: arr }));
              }} className="flex-shrink-0 ml-2" icon={<TrashIcon />} /> : null}
            </div>
          ))}
          {edit.notes.length < 1 ? (<Button onClick={() => {
            setEdit(prev => ({...prev, notes: ['']}))
          }}>Добавить описание</Button>) : null}
        </div>
        <Button onClick={submit} className="w-full mt-4">Сохранить</Button>
        <ModalActions>
          <Button onClick={() => setEdit(prev => ({ ...prev, open: false }))}>Закрыть</Button>
        </ModalActions>
      </Modal>

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
          <Button onClick={() => setModal(false)} >Закрыть</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}

export default Edit;