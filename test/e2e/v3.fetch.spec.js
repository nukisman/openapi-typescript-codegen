'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient } = require('./tests');
const compileWithTypescript = require('./scripts/compileWithTypescript');

describe('v3/fetch', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v3/fetch', 'v3', 'fetch', false, false, false, compileWithTypescript);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v3/fetch', 'v3', 'fetch', true, true, true, compileWithTypescript);
    });
});
