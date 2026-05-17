"use strict";

const { run } = require("../mongodb_connection");

class Chord {
  static async findByName(name) {
    const db = await run();
    return await db.collection('chords').findOne({ name });
  }
  
  static async create(chordData) {
    const db = await run();
    const result = await db.collection('chords').insertOne(chordData);
    return result.insertedId;
  }
  
  static async update(name, chordData) {
    const db = await run();
    await db.collection('chords').updateOne(
      { name },
      { $set: chordData }
    );
  }
  
  static async delete(name) {
    const db = await run();
    await db.collection('chords').deleteOne({ name });
  }
}

module.exports = Chord;