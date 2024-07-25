const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Record = require("./models/records");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json()); // Add this line to parse request body as JSON

app.get("/", async (req, res) => {
  try {
    const docs = await Record.find({});
    if (docs.length === 0) {
      const record = new Record({
        title: "Test",
        completed: false,
      });
      await record.save();
      console.log("Test record created");
    }
    res.send("Hello World!");
  } catch (err) {
    console.log(err);
  }
});


app.post("/create", async (req, res) => {
  const title = req.body.title;

  try {
    const record = new Record({
      title,
      completed: false,
    });
    await record.save();
    res.send("Record created");
  } catch (err) {
    console.log(err);
  }
});

app.get("/all", async (req, res) => {
  try {
    const docs = await Record.find({
      isDeleted: false,
    });
    res.send(docs);
  } catch (err) {
    console.log(err);
  }
});

app.post("/completed", async (req, res) => {
  const _id = req.body._id;
  try {
    const record = await Record.findOne({ _id });
    if (record.completed) {
      record.completed = false;
    }else{
      record.completed = true;
    }
    await record.save();
    res.send("Record updated");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const _id = req.body._id;
  try {
    const record = await Record.findOne({ _id });
    record.isDeleted = true;
    await record.save();
    res.send("Record deleted");
  } catch (err) {
    console.log(err);
  }
});

//Creating a todo application

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (e) {
    console.log(e);
  }
});
