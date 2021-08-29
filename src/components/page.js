import { CalendarIcon, DownloadIcon } from "@heroicons/react/outline";
import { format, parse } from "date-fns";
import { ru } from 'date-fns/locale'
import { useState, useRef, useEffect, useContext } from "react";
import {
    CartesianGrid,
    Line,
    Bar,
    LineChart,
    BarChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import moment from "moment"
import Modal, {Title as ModalTitle, Actions as ModalActions} from "./modal"
import Loader from "./loader";
import Table from "./table";
import Button from './button';
import labels from '../labels';
import GlobalContext from "../utils/globalContext";

const Page = ({ type }) => {
    const { date, setDate } = useContext(GlobalContext)
    const [state, setState] = useState({
        isLoading: true,
        data: {
            items: []
        }
    });
    const [modal, setModal] = useState(false);
    const handleDayClick = (day) => {
        if(moment(day).isAfter(moment())){
            return
        }
        const range = DateUtils.addDayToRange(day, date);
        setDate(range);
    };
    const wrap = useRef();
    const [width, setWidth] = useState(0);
    const resize = () => {
        if (wrap.current) {
            setWidth(wrap.current.clientWidth);
        }
    }
    useEffect(() => {
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize)
        }
    }, [])
    useEffect(() => {
        setState({
            isLoading: true,
            data: {
                items: []
            }
        })
        fetch(`/data/key?key=${type}&dateStart=${date.from.toISOString().split('T')[0]}&dateEnd=${date.to.toISOString().split('T')[0]}`)
            .then((res) => res.json())
            .then((json) => {
                setState({
                    isLoading: false,
                    data: {
                        items: json.records.map((el) => ({
                            date: format(new Date(el.date), 'd LLL y', { locale: ru }),
                            data: el.value,
                            notes: el.notes
                        }))
                    }
                })
            })
    }, [type, date])

    const data = state.isLoading ? [] : state.data.items;
    return (
        <>
            <div className="pb-4 px-8 flex items-center border-b border-gray-600">
                <Button onClick={() => setModal(true)} icon={<CalendarIcon />} />
                <div className="font-bold text-lg mx-4 flex-1">{labels[type]}</div>
                <Button disabled icon={<DownloadIcon />} />
            </div>
            <div className="py-4 px-8">
                <div className="text-sm p-4 rounded-lg bg-gray-800 w-min whitespace-nowrap">Показаны данные с <b>{format(date.from, 'd LLL y', { locale: ru })}</b> по <b>{format(date.to, 'd LLL y', { locale: ru })}</b></div>
            </div>
            <div className="py-4" ref={wrap}>
                {state.isLoading ? <Loader /> : (
                    <div className="grid grid-cols-2 gap-3">
                        <LineChart
                            width={width / 2 - 6}
                            height={350}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid stroke="#525252" vertical={false} />
                            <YAxis
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                width={32}
                            />
                            <Tooltip
                                content={({ active, payload, label }) =>
                                    active && payload ? (
                                        <div className="rounded-lg py-2 px-4 bg-gray-700 leading-none border border-gray-600">
                                            <span className="text-xs">
                                                <b>{label || "Дата"}</b>: {payload[0].value}
                                            </span>
                                        </div>
                                    ) : null
                                }
                            />
                            <XAxis
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickMargin={12}
                                dataKey="date"
                            />
                            <Line
                                type="linear"
                                dataKey="data"
                                stroke="#10B981"
                                strokeWidth={2}
                            />
                        </LineChart>
                        <BarChart
                            width={width / 2 - 6}
                            height={350}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid stroke="#525252" vertical={false} />
                            <YAxis
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                width={32}
                            />
                            <Tooltip
                                content={({ active, payload, label }) =>
                                    active && payload ? (
                                        <div className="rounded-lg py-2 px-4 bg-gray-700 leading-none border border-gray-600">
                                            <span className="text-xs">
                                                <b>{label || "Дата"}</b>: {payload[0].value}
                                            </span>
                                        </div>
                                    ) : null
                                }
                            />
                            <XAxis
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickMargin={12}
                                dataKey="date"
                            />
                            <Bar
                                type="linear"
                                dataKey="data"
                                fill="#10B981"
                                strokeWidth={2}
                            />
                        </BarChart>
                    </div>
                )}
            </div>
            <div className="px-8 py-4">
                <Table headers={[
                    {
                        label: 'Дата',
                        nowrap: true,
                        prop: 'date'
                    },
                    {
                        label: 'Кол-во',
                        nowrap: true,
                        prop: 'data'
                    },
                    {
                        label: 'Описание',
                        prop: 'desc'
                    }
                ]} data={data.map((el) => ({
                    ...el,
                    desc: (
                        <div className="divide-y divide-gray-700 divide-solid">
                            {el.notes.map((el) => (
                                <p className="py-2">{el}</p>
                            ))}
                        </div>
                    )
                }))} />
            </div>
            <Modal open={modal} close={() => setModal(false)}>
                <ModalTitle>Фильтрация по дате</ModalTitle>
                <DayPicker
                        localeUtils={MomentLocaleUtils}
                        locale="ru"
                        className={`Selectable oneMonth`}
                        numberOfMonths={1}
                        disabledDays={[{after: new Date()}]}
                        selectedDays={[date.from, date]}
                        modifiers={{start: date.from, end: date.to}}
                        onDayClick={handleDayClick}
                    />
                <ModalActions>
                        <Button onClick={() => setModal(false)} >Закрыть</Button>
                </ModalActions>
            </Modal>
        </>
    )
}

export default Page;