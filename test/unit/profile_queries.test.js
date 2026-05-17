"use strict";

require('../helpers/setup');

const assert = require('assert');
const queries = require('../../database/profile_queries');

describe('profile_queries', () => {
    describe('findUserById()', () => {
        it('should reject when id is missing', async () => {
            await assert.rejects(
                () => queries.findUserById(),
                /id is required/
            );
        });

        it('should reject when id is null', async () => {
            await assert.rejects(
                () => queries.findUserById(null),
                /id is required/
            );
        });

        it('should reject when id is empty string', async () => {
            await assert.rejects(
                () => queries.findUserById(''),
                /id is required/
            );
        });

        it('should reject when id has invalid format', async () => {
            await assert.rejects(
                () => queries.findUserById('invalid-id'),
                /Invalid user ID format/
            );
        });

        it('should reject when id is too short', async () => {
            await assert.rejects(
                () => queries.findUserById('507f1f77bcf86cd79943901'),
                /Invalid user ID format/
            );
        });
    });

    describe('findUserByEmail()', () => {
        it('should reject when email is missing', async () => {
            await assert.rejects(
                () => queries.findUserByEmail(),
                /email is required/
            );
        });

        it('should reject when email is null', async () => {
            await assert.rejects(
                () => queries.findUserByEmail(null),
                /email is required/
            );
        });
    });

    describe('createNewUser()', () => {
        it('should reject when newUser is missing', async () => {
            await assert.rejects(
                () => queries.createNewUser(),
                /newUser is required/
            );
        });

        it('should reject when newUser is null', async () => {
            await assert.rejects(
                () => queries.createNewUser(null),
                /newUser is required/
            );
        });
    });

    describe('updateUser()', () => {
        it('should reject when id is missing', async () => {
            await assert.rejects(
                () => queries.updateUser(),
                /id is required/
            );
        });

        it('should reject when updatedFields is missing', async () => {
            await assert.rejects(
                () => queries.updateUser('507f1f77bcf86cd799439011'),
                /updatedFields is required/
            );
        });
    });

    describe('deleteUser()', () => {
        it('should reject when email is missing', async () => {
            await assert.rejects(
                () => queries.deleteUser(),
                /email is required/
            );
        });
    });

    describe('getGoogleUser()', () => {
        it('should reject when profileId is missing', async () => {
            await assert.rejects(
                () => queries.getGoogleUser(),
                /profileId is required/
            );
        });

        it('should reject when profileId is null', async () => {
            await assert.rejects(
                () => queries.getGoogleUser(null),
                /profileId is required/
            );
        });
    });

    describe('linkLocalAccount()', () => {
        it('should reject when id is missing', async () => {
            await assert.rejects(
                () => queries.linkLocalAccount(),
                /id is required/
            );
        });

        it('should reject when salt is missing', async () => {
            await assert.rejects(
                () => queries.linkLocalAccount('507f1f77bcf86cd799439011'),
                /salt is required/
            );
        });

        it('should reject when hashedPassword is missing', async () => {
            await assert.rejects(
                () => queries.linkLocalAccount('507f1f77bcf86cd799439011', 'somesalt'),
                /hashedPassword is required/
            );
        });

        it('should reject when id has invalid format', async () => {
            await assert.rejects(
                () => queries.linkLocalAccount('invalid', 'somesalt', 'somehash'),
                /Invalid user ID format/
            );
        });
    });
});
