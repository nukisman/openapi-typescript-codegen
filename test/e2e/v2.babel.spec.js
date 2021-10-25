'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient } = require('./tests');
const compileWithBabel = require('./scripts/compileWithBabel');

describe('v2/babel', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v2/babel', 'v2', 'fetch', true, true, false, compileWithBabel);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v2/babel', 'v2', 'fetch', true, true, true, compileWithBabel);
    });
});
