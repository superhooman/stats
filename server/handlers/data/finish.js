const Import = require("../../models/import");
const Record = require('../../models/record');
const Year = require('../../models/year');
const { sendError, errEnum } = require("../../errors");

const finish = async (req, res) => {
    if(!req.params.id || req.params.id.length !== 24){
        return sendError(req, res, errEnum.NO_ID);
    }
    const imp = await Import.findById(req.params.id);
    if(!imp){
        return sendError(req, res, errEnum.WRONG_ID);
    }
    const data = JSON.parse(imp.content);
    for(let rec of data){
        const record = new Record({
            key: rec.reg.key,
            date: rec.date,
            value: rec.value,
            child: rec.reg.child,
            notes: rec.children
        });
        await record.save();
        if(rec.year){
            const year = await Year.findOne({key: rec.reg.key, child: !!rec.reg.child});
            if(!year){
                const newYear = new Year({
                    key: rec.reg.key,
                    value: rec.year,
                    child: rec.reg.child,
                    year: (new Date(rec.date)).getFullYear()
                })
                await newYear.save();
            }else{
                Year.findByIdAndUpdate(year._id, {
                    value: rec.year
                })
            }
        }
    }
    return res.json({
        success: true
    })
}

module.exports = finish;