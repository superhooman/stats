const Record = require("../../models/record")

const getByKey = async (req, res) => {
    const query = {
        key: req.query.key,
        child: false,
        date: {
            $gte: req.query.dateStart,
            $lte: req.query.dateEnd
        }
    }
    const records = await Record.find(query);
    return res.json({
        success: true,
        records
    })
}

module.exports = getByKey;