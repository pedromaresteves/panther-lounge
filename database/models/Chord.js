"use strict";

const { run } = require("../mongodb_connection");

class Chord {
  static async findByName(name) {
    const db = await run();
    return await db.collection('chords').findOne({ name });
  }
}

module.exports = Chord;