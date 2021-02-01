const express = require("express");
const router = express.Router();
const Records = require("../utils/airtable");
const airDB = require("../models/airtable-model");

router.get("/update", async (req, res) => {
  Records();
  res.status(201).json({ Message: "it done" });
});

router.get("/get", (req, res) => {
  airDB
    .get()
    .then((records) => {
      res.status(201).json(records);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.get("/del", (req, res) => {
  airDB.del().then(() => {
    res.status(201).json({ Message: "did it" });
  });
});

router.get("/count", (req, res) => {
  airDB
    .get()
    .then(records => {
      const count = records.length
      res.status(201).json({ 'Current Record Count': count, records })
    })
})

module.exports = router;
