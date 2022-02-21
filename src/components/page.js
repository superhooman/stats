import { CalendarIcon, DownloadIcon } from "@heroicons/react/outline";
import { format, parse } from "date-fns";
import { ru } from 'date-fns/locale'
import { useState, useRef, useEffect, useContext, useMemo, useCallback } from "react";
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
import Modal, { Title as ModalTitle, Actions as ModalActions } from "./modal"
import Loader from "./loader";
import Table from "./table";
import Button from './button';
import labels from '../labels';
import Select from './select';
import GlobalContext from "../utils/globalContext";

import 'moment/locale/ru';

const showBar = [
    'incidents',
    'security',
    'accidents',
    'pnb',
    'pollution',
    'failures',
    'directions',
    'check',
    'train',
    'meeting',
    'auto',
    'gazovoz',
    'med',
];

const ignoreDate = [
    'pnb',
    'med'
];

const currentYear = new Date().getFullYear() - 1;
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

const fixData = (data) => {
    const result = {};

    data.forEach((el) => {
        result[el.date] = result[el.date] || [];
        result[el.date].push(el);
    });

    const output = Object.keys(result).map((el) => ({
        date: el,
        data: result[el].reduce((prev, el) => {
            return prev + el.data
        }, 0),
        notes: result[el].reduce((prev, el) => {
            return [...prev, ...el.notes]
        }, []),
        timestamp: result[el][0].timestamp,
    })).sort((a, b) => a.timestamp - b.timestamp)

    return output;
}

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

const getDate = () => {
    return {
        from: moment().subtract(30, 'days').toDate(),
        to: moment().toDate(),
    }
}

const Page = ({ type }) => {
    const { date, setDate, dateTouched } = useContext(GlobalContext);
    const ignoreInitialDate = useMemo(() => {
        return ignoreDate.indexOf(type) > -1 && !dateTouched;
    }, [dateTouched, type]);
    console.log(ignoreInitialDate)
    const [month, setMonth] = useState((ignoreInitialDate ? getDate() : date).from);
    const [pageDate, setPageDate] = useState(ignoreInitialDate ? getDate() : date);
    const [state, setState] = useState({
        isLoading: true,
        data: {
            items: []
        }
    });
    const [modal, setModal] = useState(false);
    const handleDayClick = (day) => {
        if (moment(day).isAfter(moment())) {
            return
        }
        const range = DateUtils.addDayToRange(day, date);
        setPageDate(range);
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
        setPageDate(getDate())
    }, [ignoreInitialDate]);
    useEffect(() => {
        if (!ignoreInitialDate) {
            setPageDate(date)
        }
    }, [date, ignoreInitialDate]);
    useEffect(() => {
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        }
    }, []);


    useEffect(() => {
        if (!pageDate.from || !pageDate.to) {
            setState({
                isLoading: true,
                data: {
                    items: []
                }
            });
            return;
        }
        setState({
            isLoading: true,
            data: {
                items: []
            }
        })
        fetch(`/data/key?key=${type}&dateStart=${pageDate.from.toISOString().split('T')[0]}&dateEnd=${pageDate.to.toISOString().split('T')[0]}`)
            .then((res) => res.json())
            .then((json) => {
                setState({
                    isLoading: false,
                    data: {
                        items: fixData(json.records.map((el) => ({
                            timestamp: (new Date(el.date)).getTime(),
                            date: format(new Date(el.date), 'd LLL y', { locale: ru }),
                            data: el.value,
                            notes: el.notes
                        })))
                    }
                })
            })
    }, [type, pageDate])

    const data = state.isLoading ? [] : state.data.items;
    const maxCount = Math.max(...([1, ...data.map((i) => i.data)])) + 1;

    const scrollTo = useCallback((event) => {
        if (event.activePayload?.[0]?.payload?.timestamp) {
            const element = document.getElementById(event.activePayload[0].payload.timestamp);
            window.scrollTo(0, element.getBoundingClientRect().y);
        }
    }, []);

    return (
        <>
            <div className="pb-4 px-8 flex items-center border-b border-gray-600">
                <Button onClick={() => setModal(true)} icon={<CalendarIcon />} />
                <div className="font-bold text-lg mx-4 flex-1">{labels[type]}</div>
                <Button disabled icon={<DownloadIcon />} />
            </div>
            <div className="py-4 px-8">
                <div className="text-sm p-4 rounded-lg bg-gray-800 w-min whitespace-nowrap">{
                    pageDate.from && pageDate.to ? <>Показаны данные с <b>{format(pageDate.from, 'd LLL y', { locale: ru })}</b> по <b>{format(pageDate.to, 'd LLL y', { locale: ru })}</b></> : "Выберите даты"
                }</div>
            </div>
            <div className="py-4" ref={wrap}>
                {state.isLoading ? <Loader /> : (
                    <div>
                        {
                            showBar.indexOf(type) === -1 ? (
                                <LineChart
                                    width={width}
                                    height={350}
                                    data={data}
                                    onClick={scrollTo}
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
                                        tickCount={maxCount < 20 ? maxCount : 5}
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
                            ) : (
                                <BarChart
                                    width={width}
                                    height={350}
                                    data={data}
                                    onClick={scrollTo}
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
                                        cursor={{
                                            fill: '#262626'
                                        }}
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
                            )
                        }
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
                ]} data={data.filter(({ data }) => data > 0 || type === 'edu').map((el, i) => ({
                    ...el,
                    desc: (
                        <div className="divide-y divide-gray-700 divide-solid">
                            {el.notes.map((el, j) => (
                                <p key={`note-${i}-${j}`} className="py-2">{el}</p>
                            ))}
                        </div>
                    )
                }))} />
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
                    selectedDays={[pageDate.from, pageDate]}
                    modifiers={{ start: pageDate.from, end: pageDate.to }}
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
        </>
    )
}

export default Page;