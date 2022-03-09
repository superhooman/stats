const Record = require("../../models/record");
const Year = require("../../models/year");

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const startOfWeek = (date) => {
    var day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
}

const hasChild = ['accidents', 'failures'];

const getData = async (req, res) => {
    const list = ['security', 'accidents', 'work', 'failures', 'pollution', 'med', 'check', 'edu', 'incidents', 'pnb', 'directions', 'control', 'train', 'meeting', 'auto', 'gazovoz'];
    const result = {};
    const yearStart = (new Date(req.query.from.split('-')[0], 0, 1)).toISOString().split('T')[0];
    const weekDateStart = startOfWeek(new Date(req.query.to));
    const weekDateEnd = req.query.to.split('T')[0];
    const monthDateStart = startOfMonth(new Date(req.query.to)).toISOString().split('T')[0];

    for (let key of list) {
        result[key] = {};
        const week = await Record.find({
            date: {
                $gte: weekDateStart,
                $lte: weekDateEnd,
            },
            key,
            child: false
        });
        const month = await Record.find({
            date: {
                $gte: monthDateStart,
                $lte: weekDateEnd,
            },
            key,
            child: false
        });
        const yearData = await Record.find({
            date: {
                $gte: yearStart,
                $lte: weekDateEnd,
            },
            key,
            child: false
        })
        if(hasChild.indexOf(key) > -1){
            const childWeek = await Record.find({
                date: {
                    $gte: weekDateStart,
                    $lte: weekDateEnd,
                },
                key,
                child: true,
            });
            const childMonth = await Record.find({
                date: {
                    $gte: monthDateStart,
                    $lte: weekDateEnd,
                },
                key,
                child: true,
            });
            const childYear = await Record.find({
                date: {
                    $gte: yearStart,
                    $lte: weekDateEnd,
                },
                key,
                child: true,
            });
            result[key] = {
                weekMain: week.map(el => el.value).reduce((a, b) => a + b, 0),
                weekChild: childWeek.map(el => el.value).reduce((a, b) => a + b, 0),
                monthMain: month.map(el => el.value).reduce((a, b) => a + b, 0),
                monthChild: childMonth.map(el => el.value).reduce((a, b) => a + b, 0),
                yearMain: yearData.map(el => el.value).reduce((a, b) => a + b, 0),
                yearChild: childYear.map(el => el.value).reduce((a, b) => a + b, 0),
            }
        }else{
            result[key] = {
                week: week.map(el => el.value).reduce((a, b) => a + b, 0),
                month: month.map(el => el.value).reduce((a, b) => a + b, 0),
                year: yearData.map(el => el.value).reduce((a, b) => a + b, 0),
            }
        }
    }
    return res.json({
        success: true,
        data: result
    })
}

module.exports = getData;