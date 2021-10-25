'use strict';

const { executeBrowserTestsWithStaticClient, executeBrowserTestsWithInstanceClient, gen } = require('./tests');
const compileWithBabel = require('./scripts/compileWithBabel');

describe('v3/babel', () => {
    describe('static client', () => {
        executeBrowserTestsWithStaticClient('v3/babel', 'v3', 'fetch', true, true, false, compileWithBabel);
    });

    describe('instance client', () => {
        executeBrowserTestsWithInstanceClient('v3/babel', 'v3', 'fetch', true, true, true, compileWithBabel);
    });
});
