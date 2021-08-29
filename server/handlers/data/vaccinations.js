const Vaccinations = require("../../models/vaccinations");

const getOffice = async (req, res) => {
  const offices = await Vaccinations.find({});
  return res.json({
    success: true,
    offices
  });
}

const addOffice = async (req, res) => {
  const office = new Vaccinations({
    title: req.body.title,
    first: req.body.first,
    full: req.body.full,
    cannot: req.body.cannot,
    no: req.body.no,
  });
  return res.json({
    success: true,
    office: await office.save(),
  })
}

const removeOffice = async (req, res) => {
  try {
    await Vaccinations.findByIdAndRemove(req.params.id);
  } catch (err) {
    return res.json({
      success: false
    })
  }
  return res.json({
    success: true
  })
};

const editOffice = async (req, res) => {
  const office = await Vaccinations.findById(req.params.id);
  if (!office) {
    return res.json({
      success: false
    })
  }
  await Vaccinations.findByIdAndUpdate(office._id, {
    first: req.body.first,
    full: req.body.full,
    cannot: req.body.cannot,
    no: req.body.no,
  });
  return res.json({
    success: true
  })
}

module.exports = {
  addOffice,
  removeOffice,
  editOffice,
  getOffice,
}