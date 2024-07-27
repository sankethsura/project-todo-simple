const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Record = require("./models/records");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  if (process.env.DATABASE) {
    res.send(`Hello World! Database is set - ${process.env.DATABASE}`);
  } else {
    res.send("Hello World! Database is not set");
  }
});

app.get("/health", (req, res) => {
  res.send("Healthy");
});

app.get("/allDocs", async (req, res) => {
  try {
    console.log("Fetching records...");
    const docs = await Record.find({});
    console.log("Records fetched");
    if (docs.length === 0) {
      const record = new Record({
        title: "Test",
        completed: false,
      });
      await record.save();
      console.log("Test record created");
    }
    res.send(docs);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/create", async (req, res) => {
  const title = req.body.title;
  console.log("Creating record with title:", title);

  try {
    const record = new Record({
      title,
      completed: false,
    });
    await record.save();
    console.log("Record created");
    res.send("Record created");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/all", async (req, res) => {
  try {
    const docs = await Record.find({ isDeleted: false });
    res.status(200).send(docs);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/completed", async (req, res) => {
  const _id = req.body._id;
  try {
    const record = await Record.findOne({ _id });
    if (record) {
      record.completed = !record.completed;
      await record.save();
      res.send("Record updated");
    } else {
      res.status(404).send("Record not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", async (req, res) => {
  const _id = req.body._id;
  try {
    const record = await Record.findOne({ _id });
    if (record) {
      record.isDeleted = true;
      await record.save();
      res.send("Record deleted");
    } else {
      res.status(404).send("Record not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.DATABASE)
    console.log(`listening at http://localhost:${port}`);
  } catch (e) {
    console.log("Error connecting to the database", e);
  }
});
