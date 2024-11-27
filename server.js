const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const personRoute = require("./routes/PersonRoutes");
const menuRoute = require("./routes/MenuItemRoutes");
const passport = require("./auth");

//to convert any incoming type of data into json format
app.use(bodyParser.json()); //will save into req-body



app.use(passport.initialize());
const localAuthMiddleware =passport.authenticate("local",{session: false})


app.get("/", function (req, res) {
  res.send("Welcome to our hotel!");
});

//Middleware function
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]`);
  next(); //move on to the next phase
};
app.use(logRequest);

app.use("/person",   personRoute);
app.use("/menu",localAuthMiddleware, menuRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
