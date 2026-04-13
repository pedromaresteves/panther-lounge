const connection = require("./mongodb_connection.js");
const ObjectId = require('mongodb').ObjectId;

const validateObjectId = (id) => {
    if (!id || typeof id !== 'string' || !/^[a-fA-F0-9]{24}$/.test(id)) {
        return null;
    }
    try { return new ObjectId(id); }
    catch { return null; }
};

const getGoogleUser = async (profileId) => {
    if (!profileId) throw new Error('profileId is required');
    const db = await connection.run();
    try {
        const user = await db.collection("users").findOne({ googleId: profileId });
        return user;
    } catch (error) {
        console.error('Error fetching Google user:', error);
        throw error;
    }
};

const findUserById = async (id) => {
    if (!id) throw new Error('id is required');
    const objectId = validateObjectId(id);
    if (!objectId) throw new Error('Invalid user ID format');
    const db = await connection.run();
    try {
        return await db.collection("users").findOne({ _id: objectId });
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

const findUserByEmail = async (email) => {
    if (!email) throw new Error('email is required');
    const db = await connection.run();
    try {
        const user = await db.collection("users").findOne({ email: email });
        return user;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

const createNewUser = async (newUser) => {
    if (!newUser) throw new Error('newUser is required');
    const db = await connection.run();
    try {
        const result = await db.collection("users").insertOne(newUser);
        return result;
    } catch (error) {
        console.error('Error creating new user:', error);
        throw error;
    }
};

const updateUser = async (id, updatedFields) => {
    if (!id) throw new Error('id is required');
    if (!updatedFields) throw new Error('updatedFields is required');

    const forbiddenFields = ['password', 'salt', 'googleId'];
    const sanitized = Object.keys(updatedFields)
        .filter(k => !forbiddenFields.includes(k))
        .reduce((obj, k) => ({ ...obj, [k]: updatedFields[k] }), {});

    const objectId = validateObjectId(id);
    if (!objectId) throw new Error('Invalid user ID format');
    const db = await connection.run();
    try {
        return await db.collection("users").updateOne(
            { _id: objectId },
            { $set: sanitized }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (email) => {
    if (!email) throw new Error('email is required');
    const db = await connection.run();
    try {
        const result = await db.collection("users").deleteOne({ email: email });
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = { getGoogleUser, findUserById, findUserByEmail, createNewUser, updateUser, deleteUser }
