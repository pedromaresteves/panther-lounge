const connection = require("./mongodb_connection.js");
const ObjectId = require('mongodb').ObjectId;

const getGoogleUser = async (profileId) => {
    const db = await connection.run();
    const user = await db.collection("users").findOne({ googleId: profileId });
    return user;
};

const findUserById = async (id) => {
    const db = await connection.run();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    return user;
};

const findUserByEmail = async (email) => {
    const db = await connection.run();
    const user = await db.collection("users").findOne({ email: email });
    return user;
};

const createNewUser = async (newUser) => {
    const db = await connection.run();
    const result = await db.collection("users").insertOne(newUser);
    return result;
};

const updateUser = async (id, updatedFields) => {
    const db = await connection.run();
    const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });
    return result;
};

const deleteUser = async (email) => {
    const db = await connection.run();
    const result = await db.collection("users").deleteOne({ email: email });
    return result;
};

module.exports = { getGoogleUser, findUserById, findUserByEmail, createNewUser, updateUser, deleteUser }
