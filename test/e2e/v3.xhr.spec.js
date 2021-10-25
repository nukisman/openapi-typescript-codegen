'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient } = require('./tests');
const compileWithTypescript = require('./scripts/compileWithTypescript');

describe('v3/xhr', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v3/xhr', 'v3', 'xhr', false, false, false, compileWithTypescript);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v3/xhr', 'v3', 'xhr', true, true, true, compileWithTypescript);
    });
});
