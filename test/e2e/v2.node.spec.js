'use strict';

const generate = require('./scripts/generate');
const compileWithTypescript = require('./scripts/compileWithTypescript');
const server = require('./scripts/server');

describe('v2.node', () => {
    beforeAll(async () => {
        await generate('v2/node', 'v2', 'node');
        compileWithTypescript('v2/node');
        await server.start('v2/node');
    }, 30000);

    afterAll(async () => {
        await server.stop();
    });

    it('requests token', async () => {
        const { OpenAPI, SimpleService } = require('./generated/v2/node/index.js');
        const tokenRequest = jest.fn().mockResolvedValue('MY_TOKEN');
        OpenAPI.TOKEN = tokenRequest;
        const result = await SimpleService.getCallWithoutParametersAndResponse();
        expect(tokenRequest.mock.calls.length).toBe(1);
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('complexService', async () => {
        const { ComplexService } = require('./generated/v2/node/index.js');
        const result = await ComplexService.complexTypes({
            first: {
                second: {
                    third: 'Hello World!',
                },
            },
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        try {
            const { SimpleService } = require('./generated/v2/node/index.js');
            const promise = SimpleService.getCallWithoutParametersAndResponse();
            setTimeout(() => {
                promise.cancel();
            }, 10);
            await promise;
        } catch (e) {
            expect(e.message).toContain('The user aborted a request.');
        }
    });
});

describe('v2.node with client', () => {
    beforeAll(async () => {
        await generate('v2/node_client', 'v2', 'node', false, false, true);
        compileWithTypescript('v2/node_client');
        await server.start('v2/node_client');
    }, 30000);

    afterAll(async () => {
        await server.stop();
    });

    it('requests token', async () => {
        const tokenRequest = jest.fn().mockResolvedValue('MY_TOKEN');
        const { AppClient } = require('./generated/v2/node_client/index.js');
        const client = new AppClient({ TOKEN: tokenRequest });
        const result = await client.simple.getCallWithoutParametersAndResponse();
        expect(tokenRequest.mock.calls.length).toBe(1);
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('complexService', async () => {
        const { AppClient } = require('./generated/v2/node_client/index.js');
        const client = new AppClient();
        const result = await client.complex.complexTypes({
            first: {
                second: {
                    third: 'Hello World!',
                },
            },
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        try {
            const { AppClient } = require('./generated/v2/node_client/index.js');
            const client = new AppClient();
            const promise = await client.simple.getCallWithoutParametersAndResponse();
            setTimeout(() => {
                promise.cancel();
            }, 10);
            await promise;
        } catch (e) {
            expect(e.message).toContain('The user aborted a request.');
        }
    });
});
