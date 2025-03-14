const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const schema = mongoose.Schema;
const types = schema.Types;
const AbstractSchema = require("../../../schema/abstract/abstract.schema");
const _ = require("lodash");
const connectionSchema = new AbstractSchema({
  name: { type: types.String, required: true },
  client_ip: { type: types.String,default: "192.168.1.1" , required: false },
  client_port: { type: types.String, default: "80", required: false },
  server_ip: { type: types.String,default: "192.168.1.1" , required: false },
  server_port: { type: types.String, default: "80" ,required: false },
  protocol: { type: types.String, default: "HTTPS",required: false },
  
 
});
connectionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("connection", connectionSchema, "connection");
