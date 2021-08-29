import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { Chart } from "react-google-charts";
import Layout from "../components/layout";
import { useEffect, useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const colors = [
    '#3366cc',
    '#109618',
    '#ff9900',
    '#dc3912'
];

const labels = [
    'Вакцинировались I компонентом',
    'Полностью вакцинировались',
    'Имеют противопоказания',
    'Не вакцинировались',
]

const Vaccinated = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/data/vaccinations')
            .then((res) => res.json())
            .then((json) => {
                setData(json.offices);
            })
    }, [])

    return (
        <>
            <div className="font-bold text-lg mx-4 flex-1">Данные по вакцинации</div>
            <div className="text-sm px-4 py-2 ml-4 mt-4 rounded-lg bg-gray-800 w-min whitespace-nowrap">
                {
                    colors.map((color, i) => (
                        <div key={color} className="flex items-center py-1">
                            <div style={{
                                backgroundColor: color
                            }} className="w-4 h-4 rounded mr-3" />
                            <span>{labels[i]}</span>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-wrap pt-8">
                {data.map((el) => (
                    <div key={el._id}>
                        <h1 className="text-center font-bold -mb-8">{el.title}</h1>
                        <Chart
                            width={'500px'}
                            height={'300px'}
                            chartType="PieChart"
                            loader={<div>Загрузка</div>}
                            data={[
                                ['Группа', 'Кол-во'],
                                [labels[0], el.first],
                                [labels[1], el.full],
                                [labels[2], el.cannot],
                                [labels[3], el.no]
                            ]}
                            options={{
                                is3D: true,
                                legend: 'none',
                                colors,
                            }}
                            rootProps={{ class: 'chart' }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

Vaccinated.getLayout = page => (
    <Layout>
        {page}
    </Layout>
)

export default Vaccinated;