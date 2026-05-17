"use strict";

const path = require('path');

/**
 * Mocks a Node.js module by injecting into require.cache before the module
 * under test imports it. Use in a beforeEach/before hook.
 *
 * @param {string} moduleSpec - The module specifier as it would be required
 *   from a file at `fromDir`. E.g. '../database/queries'
 * @param {string} fromDir - The directory of the file that does the require().
 *   Use path.resolve() or __dirname of the requiring file.
 * @param {object} mockExports - The mock exports object.
 * @returns {Function} A cleanup function that restores the original cache.
 */
function mockModule(moduleSpec, fromDir, mockExports) {
  const resolvedPath = require.resolve(path.resolve(fromDir, moduleSpec));
  const original = require.cache[resolvedPath];
  require.cache[resolvedPath] = {
    id: resolvedPath,
    filename: resolvedPath,
    loaded: true,
    exports: mockExports
  };
  return function restore() {
    if (original) {
      require.cache[resolvedPath] = original;
    } else {
      delete require.cache[resolvedPath];
    }
  };
}

/**
 * Creates mock Express req and res objects for testing controllers.
 * @param {object} reqOverrides - Properties to set on req (e.g. { user, body, params, query })
 * @returns {{ req: object, res: object }} Mock req and res
 */
function createMockReqRes(reqOverrides = {}) {
  const res = {
    statusCode: null,
    _headers: {},
    _body: null,
    _redirectUrl: null,
    _view: null,
    _viewData: null,

    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this._body = body;
      return this;
    },
    redirect(url) {
      this._redirectUrl = url;
      return this;
    },
    render(view, data) {
      this._view = view;
      this._viewData = data;
      return this;
    },
    clearCookie() { return this; }
  };

  const req = {
    user: null,
    body: {},
    params: {},
    query: {},
    session: {},
    url: '/test',
    ...reqOverrides,
    logout(cb) {
      this._loggedOut = true;
      if (cb) cb(null);
    }
  };

  return { req, res };
}

module.exports = { mockModule, createMockReqRes };
