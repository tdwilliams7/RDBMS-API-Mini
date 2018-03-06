const express = require("express");
const bodyParser = require("body-parser");

const knex = require("./database/db");
const bearRouter = express.Router();

bearRouter.post("/", (req, res) => {
  const { zooId, species, latinName } = req.body;
  const bear = { zooId, species, latinName };
  if (!zooId) {
    res.status(422).json({ err: "Include a zooId" });
  } else if (!species) {
    res.status(422).json({ err: "include a species name" });
  } else if (!latinName) {
    res.status(422).json({ err: "include a latinName" });
  } else {
    knex
      .insert(req.body)
      .into("bears")
      .then(id => {
        res.status(200).json(id);
      })
      .catch(err => {
        res
          .status(500)
          .json({ err: "error adding. did you include a valid zooId" });
      });
  }
});

bearRouter.get("/", (req, res) => {
  knex("bears")
    .then(bears => {
      if (bears.length) {
        res.status(200).json(bears);
      } else {
        res.status(404).json({ msg: "no bears found" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: "error getting the bears" });
    });
});

bearRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  knex("bears")
    .where({ id })
    .then(bear => {
      if (bear.length) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ msg: `Bear with id: ${id} not found` });
      }
    })
    .catch(err => {
      res.status(500).json({ err: "err gettign the bear" });
    });
});

bearRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedBear = req.body;
  knex("bears")
    .where({ id })
    .then(bear => {
      if (bear.length) {
        knex("bears")
          .where({ id })
          .update(updatedBear)
          .then(newBear => {
            knex("bears")
              .where({ id })
              .then(bear => {
                res.status(200).json(bear);
              })
              .catch(err => {
                res.status(404).json({ msg: "cannot find bear" });
              });
          })
          .catch(err => {
            res.status(500).json({ err: "Error updating bear" });
          });
      } else {
        res.status(404).json({ msg: `Bear with id: ${id} not found` });
      }
    })
    .catch(err => {
      res.send(err);
    });
});

bearRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  knex("bears")
    .where({ id })
    .then(bear => {
      if (bear.length) {
        knex("bears")
          .where({ id })
          .del()
          .then(succ => {
            res.status(200).json({ msg: "bear gone" });
          })
          .catch(err => {
            res.status(500).json({ msg: "error deleting bear" });
          });
      } else {
        res.status(404).json({ msg: "can't find the homie" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: "Error finding bear to delete" });
    });
});

module.exports = bearRouter;
