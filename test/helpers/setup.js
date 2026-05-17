"use strict";

process.env.DBCONNECTION = process.env.DBCONNECTION || 'mongodb:url';
process.env.PORT = process.env.PORT || '5000';
process.env.sessionCookieKey = process.env.sessionCookieKey || 'test-session-secret-key';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/redirect';
