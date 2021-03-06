const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv/config");

//middleware

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
  res.send("This is PollRoll API");
});

//import routes
const userRoute = require("./Routes/userRouter");
app.use("/users", userRoute);

const pollRoute = require("./Routes/pollRouter");
app.use("/polls", pollRoute);

const voteLinkRoute = require("./Routes/voteLinkRouter");
app.use("/voteat", voteLinkRoute);

//connect to DB
mongoose
  .connect(process.env.REACT_APP_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    dbName: "pollroll_db",
  })
  .then(() => console.log("connected db"))
  .catch((err) => console.log(err));

//start listening to the server
app.listen(process.env.PORT || 80);
