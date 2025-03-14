const express = require("express");
const router = express.Router();
const DataController = require("../../data/controllers/data.controller");
const DataMiddlewares = require("../../data/middlewares/data.middleweres");

router.post(
  "/insert_data/:connectionName",
  DataMiddlewares.validateData,
  DataController.insertData.bind(DataController)
);
module.exports = router;
