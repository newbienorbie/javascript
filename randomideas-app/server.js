const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");

connectDB();

const app = express();

// static folder
app.use(express.static(path.join(__dirname, "public")));

// body parser middleware: allows us to access body.something in the post request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors middleware
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  // res.send( "Hello World" ); // header content-type: text/html
  res.send({ message: "Welcome to the RandomIdeas API" }); // header content-type: application/json
  // res.json({ message: "Hello World" }); // header content-type: application/json
});

const ideasRouter = require("./routes/ideas");
app.use("/api/ideas", ideasRouter); // set the router to api/ideas so in ideas.js we don't have to specify api/ideas in the router (/ for all ideas and /:id for single idea)

app.listen(port, () => console.log(`Server listening on port ${port}`));
