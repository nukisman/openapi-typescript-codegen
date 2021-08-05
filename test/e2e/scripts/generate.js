'use strict';

const OpenAPI = require('../../../dist');

async function generate(dir, version, client, useOptions = false, useUnionTypes = false, exportClient = false) {
    await OpenAPI.generate({
        input: `./test/spec/${version}.json`,
        output: `./test/e2e/generated/${dir}/`,
        httpClient: client,
        useOptions,
        useUnionTypes,
        exportClient,
    });
}

module.exports = generate;
