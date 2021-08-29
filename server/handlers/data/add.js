const Record = require('../../models/record');
const { sendError, errEnum } = require("../../errors");

const add = async (req, res) => {
  if (!req.body.type || !req.body.date) {
    return sendError(req, res, errEnum.FORM_ERROR);
  }
  const record = new Record({
    key: req.body.type,
    date: req.body.date,
    value: req.body.value,
    child: req.body.subType === 'child',
    notes: req.body.comment
  });
  const saved = await record.save();
  return res.json({
    success: true,
    record: saved
  })
}

module.exports = add;