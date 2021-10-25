'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient } = require('./tests');
const compileWithTypescript = require('./scripts/compileWithTypescript');

describe('v2/fetch', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v2/fetch', 'v2', 'fetch', false, false, false, compileWithTypescript);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v2/fetch', 'v2', 'fetch', true, true, true, compileWithTypescript);
    });
});
