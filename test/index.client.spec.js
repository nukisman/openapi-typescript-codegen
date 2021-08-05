'use strict';

const OpenAPI = require('../dist');
const glob = require('glob');
const fs = require('fs');

describe('v2', () => {
    it('should generate with exportClient', async () => {
        await OpenAPI.generate({
            input: './test/spec/v2.json',
            output: './test/generated/v2_client',
            httpClient: OpenAPI.HttpClient.FETCH,
            useOptions: false,
            useUnionTypes: false,
            exportCore: true,
            exportSchemas: true,
            exportModels: true,
            exportServices: true,
            exportClient: true,
            clientName: 'TestClient',
        });

        glob.sync('./test/generated/v2_client/**/*.ts').forEach(file => {
            const content = fs.readFileSync(file, 'utf8').toString();
            expect(content).toMatchSnapshot(file);
        });
    });
});

describe('v3', () => {
    it('should generate with exportClient', async () => {
        await OpenAPI.generate({
            input: './test/spec/v3.json',
            output: './test/generated/v3_client',
            httpClient: OpenAPI.HttpClient.FETCH,
            useOptions: false,
            useUnionTypes: false,
            exportCore: true,
            exportSchemas: true,
            exportModels: true,
            exportServices: true,
            exportClient: true,
            clientName: 'TestClient',
        });

        glob.sync('./test/generated/v3_client/**/*.ts').forEach(file => {
            const content = fs.readFileSync(file, 'utf8').toString();
            expect(content).toMatchSnapshot(file);
        });
    });
});
