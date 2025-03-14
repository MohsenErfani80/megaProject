const express = require("express");
const router = express.Router();

const data_router = require("./data/routes/data.routes");


router.use("/data/v1", data_router);


module.exports = router;
