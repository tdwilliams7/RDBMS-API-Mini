const express = require("express");
const bodyParser = require("body-parser");

const zooRouter = express.Router();
const knex = require("./database/db");

const db = require("./zooController");

zooRouter.get("/", (req, res) => {
  db
    .getAll()
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json({ error: "No zoos found or error getting zoos" });
    });
});

zooRouter.post("/", (req, res) => {
  const { name } = req.body;
  if (name) {
    db
      .addZoo(name)
      .then(id => {
        res.status(201).json({ success: `${name} created with id: ${id}` });
      })
      .catch(err => {
        res.status(500).json({ error: "problem adding the zoo" });
      });
  } else {
    res.status(422).json({ error: "Please pass in a name, man!" });
  }
});

zooRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  db
    .getById(id)
    .then(zoo => {
      if (zoo.length) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: `Cannot find zoo with id: ${id}` });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error getting zooos" });
    });
});
//
zooRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedzoo = req.body;
  db
    .update(id, updatedzoo)
    .then(zoo => {
      knex("zoos")
        .where({ id })
        .then(zoo => {
          res.status(200).json(zoo);
        })
        .catch(err => {
          res.status(404).json({ msg: `Could not find zoo with id: ${id}` });
        });
    })
    .catch(err => {
      res.status(404).json({ msg: `Could not find zoo with id: ${id}` });
    });
});

zooRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.getById(id).then(zoo => {
    if (zoo.length) {
      db
        .nuke(id)
        .then(success => {
          res
            .status(200)
            .json({ msg: `Zoo with id: ${id} successfully deleted` });
        })
        .catch(fail => {
          res
            .status(500)
            .json({ error: `Zoo with id: ${id} could not be deleted` });
        });
    } else {
      res.status(404).json({ msg: `Zoo with id : ${id} does not exist.` });
    }
  });
});

module.exports = zooRouter;
