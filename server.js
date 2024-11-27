const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const personRoute=require('./routes/PersonRoutes')
const menuRoute=require('./routes/MenuItemRoutes')
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

//to convert any incoming type of data into json format
app.use(bodyParser.json()); //will save into req-body
app.get("/", function (req, res) {
    res.send("Welcome");
});

app.use('/person', personRoute);
app.use('/menu', menuRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
