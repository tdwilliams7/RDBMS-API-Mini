const knex = require("./database/db");

const db = {
  getAll: () => {
    return knex("zoos");
  },
  getById: id => {
    return knex("zoos").where({ id });
  },
  addZoo: name => {
    return knex.insert({ name }).into("zoos");
  },
  nuke: id => {
    return knex("zoos")
      .where({ id })
      .del();
  },
  update: (id, zoo) => {
    return knex("zoos")
      .where({ id })
      .update(zoo);
  }
};

module.exports = db;
