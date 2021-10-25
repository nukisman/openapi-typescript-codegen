'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient } = require('./tests');
const compileWithTypescript = require('./scripts/compileWithTypescript');

describe('v2/xhr', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v2/xhr', 'v2', 'xhr', false, false, false, compileWithTypescript);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v2/xhr', 'v2', 'xhr', true, true, true, compileWithTypescript);
    });
});
