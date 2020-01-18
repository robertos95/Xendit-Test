const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const isOrgExists = require('./middleware/is-org-exists');
const errorController = require('./controllers/error');

const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-foqcq.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

// ROUTES
const orgsRoutes = require("./routes/orgs");

const app = express();

app.use(bodyParser.json());

// Check if organization exists
// if not return Error Org Not found

// Else, use the orgsRoutes

app.use("/orgs", isOrgExists, orgsRoutes);

// Error Controller
app.use(errorController.get404);

// app.listen(8080);
// console.log(process.env.MONGO_USER);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(result => {
    console.log("Connected!");
    //TODO: SET UP ENV PORT
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => {
    console.log(err);
  });
