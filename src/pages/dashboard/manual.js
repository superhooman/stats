import { useState } from 'react';
import dynamic from 'next/dynamic';
import moment from "moment"
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import Button from '../../components/button';
import Select from '../../components/select';
import Input from '../../components/input';
import {Title as ModalTitle, Actions as ModalActions} from '../../components/modal';
import axios from 'axios';

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

const hasChildAndMain = ['accidents', 'failures']

const Manual = () => {
  const [type, setType] = useState('security');
  const [subType, setSubType] = useState('main');
  const [date, setDate] = useState(moment().toDate());
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);

  const handleDayClick = (day, {selected}) => {
    setDate(selected ? undefined : day)
  }

  const submit = () => {
    axios({
      url: `/data/add`,
      method: "POST",
      data: {
        type,
        subType,
        date,
        value,
        comment
      }
    }).then((res) => {
      if(res.data && res.data.success){
        setComment("");
        setValue(0);
        alert("Добавлено");
      }
    })
  }

  return (
    <div className="max-w-xl py-8 px-4 mx-auto">
      <h1 className="text-xl font-semibold">Ручное добавление данных</h1>
      <div className="grid grid-cols-1 gap-6 py-8">
        <Select
          label="Тип"
          withLabel
          value={type}
          onChange={({ target }) => {
            setType(target.value);
            if (hasChildAndMain.indexOf(target.value) === -1) {
              setSubType('main');
            }
          }}
          options={Object.keys(types).map((type) => (
            {
              label: types[type],
              value: type
            }
          ))}
        />
        <Select
          disabled={hasChildAndMain.indexOf(type) === -1}
          label="Подтип"
          onChange={({ target }) => {
            setSubType(target.value)
          }}
          value={subType}
          withLabel
          options={[
            {
              value: 'main',
              label: 'Компания'
            },
            {
              value: 'child',
              label: 'Подрядные орг.'
            }
          ]}
        />
        <Input type="number" min={0} value={value} onChange={e => setValue(Number(e.target.value))} label="Кол-во" withLabel />
        <Button onClick={() => setModal(true)}>Дата: {moment(date).format("DD.MM.YYYY")}</Button>
        <Input type="textarea" value={comment} onChange={e => setComment(e.target.value)} label="Комментарий" withLabel />
        <Button onClick={submit}>Добавить</Button>
      </div>
      <Modal open={modal} close={() => setModal(false)}>
        <ModalTitle>Дата</ModalTitle>
        <DayPicker
          localeUtils={MomentLocaleUtils}
          locale="ru"
          className={`Selectable oneMonth`}
          numberOfMonths={1}
          selectedDays={date}
          onDayClick={handleDayClick}
        />
        <ModalActions>
          <Button onClick={() => setModal(false)} >Закрыть</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}

export default Manual;