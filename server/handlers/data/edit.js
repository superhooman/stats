const Record = require('../../models/record');
const { sendError, errEnum } = require("../../errors");

const edit = async (req, res) => {
  if (!req.body.value) {
    return sendError(req, res, errEnum.FORM_ERROR);
  }
  if (!req.params.id) {
    return sendError(req, res, errEnum.FORM_ERROR);
  }
  const record = await Record.findById(req.params.id);
  if (!record) {
    return sendError(req, res, errEnum.FORM_ERROR);
  }
  await Record.findByIdAndUpdate(record._id, {
    value: req.body.value,
    notes: req.body.notes || []
  })
  return res.json({
    success: true,
  })
}

module.exports = edit;