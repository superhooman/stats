const xlsx = require('node-xlsx');
const { sendError, errEnum } = require('../../errors');
const Import = require('../../models/import');

const upload = async (req, res) => {
    if(!req.file){
        return sendError(req, res, errEnum.NO_FILE);
    }
    try{
        const data = parseFile(req.file.path);
        const imp = await (new Import({
            content: JSON.stringify(data)
        })).save();
        return res.json({
            success: true,
            import: {
                id: imp._id,
                data
            }
        })
    }catch(err){
        console.log(err);
        return res.json({
            success: false
        })
    }
    
}

const parseFile = (filepath) => {
    const obj = xlsx.parse(filepath);
    const nameReg = {
        security: /Количество(\s*)инцидентов(\s*)по(\s*)СБ(\s*)на(\s*)нефтепромыслах,(\s*)ед/,
        accidents: /Количество(\s*)несчастных(\s*)случаев,(\s*)связанных(\s*)с(\s*)трудовой(\s*)деятельностью(\s*)/,
        failures: /Количество(\s*)аварий,(\s*)пожаров/,
        incidents: /Количество(\s*)инцидентов/,
        pollution: /Загрязнение(\s*)окружающей(\s*)среды/,
        pnb: /Количество(\s*)проведенных(\s*)ПНБ/,
        directions: /Количество(\s*)выданных(\s*)указаний/,
        check: /Количество(\s*)проверок/,
        control: /Контроль(\s*)за(\s*)выполнением(\s*)работ/,
        edu: /Проведено(\s*)обучений(\s*)работников(\s*)по(\s*)запланированным(\s*)программам/,
        train: /Проведено(\s*)учебно-тренировочных(\s*)занятий(\s*)с(\s*)пожарными(\s*)расчетами/,
        meeting: /Проведено(\s*)собраний\/совещаний(\s*)по(\s*)безопасности/,
        auto: /Проверено(\s*)автотранспорта(\s*)и(\s*)спецтехники/,
        gazovoz: /Проверено(\s*)автогазовозов/,
        work: /Были(\s*)приостановлены(\s*)работы(\s*)по(\s*)причине(\s*)нарушений(\s*)безопасности/,
        med: /Количество(\s*)медицинских(\s*)эвакуаций(\s*)по(\s*)болезни(\s*)работников/
    }
    const hasChildAndMain = {
        accidents: /в(\s*)Компании/,
        failures: /в(\s*)Компании/,
    }

    const getRegName = (name) => {
        const keys = Object.keys(nameReg);
        for (let key of keys) {
            if (nameReg[key].test(name)) {
                const hasChildren = hasChildAndMain[key];
                if (hasChildren) {
                    return {
                        key,
                        child: !hasChildren.test(name)
                    }
                }
                return {
                    key
                };
            }
        }
        return null;
    }

    const getDate = (line) => {
        const dateRegex = /с\s*((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[012]).20\d\d)\s*по\s*((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[012]).20\d\d)/
        const out = line.match(dateRegex);
        return out[4];
    }

    const data = [];
    let lastIndex = -1;
    const date = getDate(obj[0].data[0][0]).split('.').reverse().join('-')

    for (let line of obj[0].data) {
        if (!line || line.length < 2) {
            continue;
        }
        if (line[1] && getRegName(line[1])) {
            lastIndex = data.length;
        } else {
            if (line[0] === "№" || /Показатели(\s*)по/.test(line[1])) {
                continue;
            }
            if (lastIndex > -1 && typeof line[5] === 'string' && line[5].trim()) {
                data[lastIndex].children.push(line[5])
            }
            continue;
        }
        data.push({
            date: new Date(`${date}T12:00:00.000Z`),
            reg: getRegName(line[1]),
            value: Number(line[3]) || 0,
            year: Number(line[4]) || 0,
            children: typeof line[5] === 'string' && line[5].trim() ? [
                line[5]
            ] : []
        });
    }

    return data;
}

module.exports = upload;