const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
const routes = require("./modules/routes");
const path = require("path");
const errorhandler = require("errorhandler");
const session = require("express-session");
const cron = require("node-cron");


app.set("view gine", "pug");
app.set("views", path.join(__dirname, "view"));

module.exports = class Application {
  constructor() {
    this.setupDataBase();
    this.setupServer();
    this.setupMiddlewares();
    this.setupErrors();
    this.setupRoutes();

  }

  async setupServer() {
    const port = process.env.PORT || 3002;
    await app.listen(port, (error) => {
      if (error) {
        console.error(`Error running the application :\n${error}`);
      } else {
        console.info(`Application running on port ${port}.`);
      }
    });
  }

////////

/////////
  async setupDataBase() {
    await mongoose.set("strictQuery", false);
    await mongoose
      .connect(process.env.MONGODB_CONNECTION)
      .then(() => {
        console.info("Database connected successfully.");
      })
      .catch((error) => {
        console.error(`Error connecting to database :\n${error}`);
      });
    mongoose.Promise = global.Promise;
  }

  async setupMiddlewares() {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: "application/json" }));

    app.use(helmet.contentSecurityPolicy());
    app.use(helmet.crossOriginEmbedderPolicy());
    app.use(helmet.crossOriginOpenerPolicy());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.originAgentCluster());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());
    app.use(cookieParser());
    // app.use(csrf({ cookie: true }));
    // app.use(
    //   rateLimit({
    //     windowMs: 60000,
    //     max: 300,
    //     message: {
    //       date: new Date(),
    //       success: false,
    //       statusCode: 429,
    //       message: "We have received too many requests from you.",
    //     },
    //     validate: { xForwardedForHeader: false },
    //   })
    // );
    app.use((req, res, next) => {
      if (Number(res.statusCode) >= 500) {
        return res.status(500).json({
          date: new Date(),
          success: false,
          statusCode: 500,
          message: "An error occurred on the server side.",
        });
      }
      next();
    });
    app.use((req, res, next) => {
      req.time = new Date(Date.now()).toString();
      console.log(req.method, req.hostname, req.path, req.time);
      next();
    });
    app.use(compression());
    app.use(mongoSanitize());
    app.use(hpp());
    app.use(cors());

    app.disable("x-powered-by");

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    app.use(errorhandler());

    console.info("Setup all middlewares.");
  }

  async setupErrors() {
    // app.use(errorMiddleware);

    process.on("uncaughtException", (error) => {
      console.error(error);
      app.use((req, res, next) => {
        throw new Error("Something broke!");
      });
    });
    process.on("unhandledRejection", (error) => {
      console.error(error);
      app.use((req, res, next) => {
        throw new Error("Something broke!");
      });
    });

    console.info("Setup errors handlers.");
  }

  async setupRoutes() {
    app.use(routes);
    console.info("Setup all routes.");
  }
};
