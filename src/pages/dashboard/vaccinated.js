import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Button from '../../components/button';
import Select from '../../components/select';
import Input from '../../components/input';
import { Title as ModalTitle, Actions as ModalActions } from '../../components/modal';
import axios from 'axios';

const Modal = dynamic(() => import('../../components/modal'), {
  ssr: false
})

const labels = {
  first: 'Вакцинировались I компонентом',
  full: 'Полностью вакцинировались',
  cannot: 'Имеют противопоказания',
  no: 'Не вакцинировались',
}

const Vaccinated = () => {
  const [offices, setOffices] = useState([]);
  const [modal, setModal] = useState({
    active: false,
    item: {}
  })

  const getOffices = () => {
    axios('/data/vaccinations').then((res) => {
      if (res.data) {
        setOffices(res.data.offices || []);
      }
    })
  }

  useEffect(getOffices, []);

  return (
    <div className="max-w-xl py-8 px-4 mx-auto">
      <h1 className="text-xl font-semibold">Данные по вакцинации</h1>
      <h3 className="font-semibold text-md mt-2 opacity-60">Офисы</h3>
      {offices.length ? offices.map((el) => (
        <div className="py-2 px-4 pb-4 border-gray-700 border rounded-lg my-4" key={el._id}>
          <h4 className="font-semibold my-2 text-xl">{el.title}</h4>
          <div className="divide-y divide-gray-700">
            {Object.keys(labels).map((key) => (
              <div className="py-2" key={el._id + key}>
                {labels[key]}:&nbsp;<b>{el[key]}</b>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => setModal({
            active: true, item: {
              ...el,
              id: el._id
            }
          })}>Редактировать</Button>
        </div>
      )) : (<div className="text-center py-8 uppercase font-semibold text-sm opacity-60 tracking-widest">Пусто</div>)}
      <Button className="w-full" onClick={() => setModal({ active: true, item: {} })}>Добавить</Button>
      <EditOrCreate onDone={getOffices} open={modal.active} close={() => setModal((v) => ({ ...v, active: false }))} {...modal.item} />
    </div>
  )
}

const EditOrCreate = ({ id, title = "", first = 0, full = 0, cannot = 0, no = 0, open, close, onDone }) => {
  const create = !id;
  const [data, setData] = useState({
    title,
    first,
    full,
    cannot,
    no
  });
  useEffect(() => {
    setData({
      title,
      first,
      full,
      cannot,
      no
    })
  }, [id, title, first, full, cannot, no]);
  const add = () => {
    axios('/data/vaccinations', {
      data,
      method: "POST",
    }).then((res) => {
      if (res.data) {
        onDone();
        close();
        setData({
          title: "",
          first: 0,
          full: 0,
          cannot: 0,
          no: 0
        })
      }
    })
  }
  const edit = () => {
    axios('/data/vaccinations/' + id, {
      data,
      method: "POST",
    }).then((res) => {
      if (res.data) {
        onDone();
        close();
      }
    })
  }
  const remove = () => {
    if (!confirm('Вы уверены?')) {
      return;
    }

    axios({
      url: '/data/vaccinations/' + id,
      method: 'DELETE'
    }).then((res) => {
      onDone();
      close();
    })
  }
  return (
    <Modal open={open} close={close}>
      <ModalTitle>{create ? 'Создание' : 'Редактирование'}</ModalTitle>
      {create ? <Input placeholder="Название" value={data.title} onChange={(e) => setData(v => ({ ...v, title: e.target.value }))} /> : <h4 className="font-semibold my-2 text-xl">{data.title}</h4>}
      <div className="divide-y divide-gray-700 mt-2 py-2 px-4 border border-gray-700 rounded-lg">
        {Object.keys(labels).map((key) => (
          <div key={key} className="py-3">
            <Input label={labels[key]} withLabel value={data[key]} onChange={(e) => setData(v => ({ ...v, [key]: Number(e.target.value) }))} type="number" />
          </div>
        ))}
      </div>
      {!create && <Button className="w-full mt-4" onClick={remove}>Удалить</Button>}
      <ModalActions>
        <Button onClick={create ? add : edit}>{create ? 'Добавить' : 'Сохранить'}</Button>
        <Button onClick={close} >Закрыть</Button>
      </ModalActions>
    </Modal>
  )
}

export default Vaccinated;