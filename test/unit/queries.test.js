"use strict";

require('../helpers/setup');

const assert = require('assert');
const queries = require('../../database/queries');

describe('database/queries', () => {
  describe('withErrorHandling()', () => {
    it('should return the result when wrapped function succeeds', async () => {
      const fn = async () => 'success';
      const wrapped = queries.withErrorHandling(fn);
      const result = await wrapped();
      assert.strictEqual(result, 'success');
    });

    it('should re-throw when wrapped function fails', async () => {
      const fn = async () => { throw new Error('test error'); };
      const wrapped = queries.withErrorHandling(fn);
      await assert.rejects(
        () => wrapped(),
        /test error/
      );
    });

    it('should forward arguments to wrapped function', async () => {
      const fn = async (a, b) => a + b;
      const wrapped = queries.withErrorHandling(fn);
      const result = await wrapped(1, 2);
      assert.strictEqual(result, 3);
    });
  });
});
