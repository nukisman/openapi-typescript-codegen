const browser = require('./scripts/browser');
const copy = require('./scripts/copy');
const server = require('./scripts/server');
const generate = require('./scripts/generate');
const compileWithTypescript = require('./scripts/compileWithTypescript');

const TIMEOUT = 20000;

function executeBrowserTestsWithStaticClient(dir, version, client, useOptions, useUnionTypes, exportClient, compile) {
    beforeAll(async () => {
        await generate(dir, version, client, useOptions, useUnionTypes, exportClient);
        await copy(dir);
        await compile(dir);
        await server.start(dir);
        await browser.start();
    }, TIMEOUT);

    afterAll(async () => {
        await browser.stop();
        await server.stop();
    }, TIMEOUT);

    it('requests token', async () => {
        await browser.exposeFunction('tokenRequest', jest.fn().mockResolvedValue('MY_TOKEN'));
        const result = await browser.evaluate(async () => {
            const { OpenAPI, SimpleService } = window.api;
            OpenAPI.TOKEN = window.tokenRequest;
            return await SimpleService.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const result = await browser.evaluate(async () => {
            const { OpenAPI, SimpleService } = window.api;
            OpenAPI.TOKEN = undefined;
            OpenAPI.USERNAME = 'username';
            OpenAPI.PASSWORD = 'password';
            return await SimpleService.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('complexService', async () => {
        const result = await browser.evaluate(async () => {
            const { ComplexService } = window.api;
            return await ComplexService.complexTypes({
                first: {
                    second: {
                        third: 'Hello World!',
                    },
                },
            });
        });
        expect(result).toBeDefined();
    });

    it('formData', async () => {
        const result = await browser.evaluate(async () => {
            const { ParametersService } = window.api;
            return await ParametersService.callWithParameters('valueHeader', 'valueQuery', 'valueForm', 'valueCookie', 'valuePath', {
                prop: 'valueBody',
            });
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        try {
            await browser.evaluate(async () => {
                const { SimpleService } = window.api;
                const promise = SimpleService.getCallWithoutParametersAndResponse();
                setTimeout(() => {
                    promise.cancel();
                }, 10);
                await promise;
            });
        } catch (e) {
            expect(e.message).toContain('The user aborted a request.');
        }
    });
}

function executeBrowserTestsWithInstanceClient(dir, version, client, useOptions, useUnionTypes, exportClient, compile) {
    beforeAll(async () => {
        await generate(dir, version, client, useOptions, useUnionTypes, exportClient);
        await copy(dir);
        await compile(dir);
        await server.start(dir);
        await browser.start();
    }, TIMEOUT);

    afterAll(async () => {
        await browser.stop();
        await server.stop();
    }, TIMEOUT);

    it('requests token', async () => {
        await browser.exposeFunction('tokenRequest', jest.fn().mockResolvedValue('MY_TOKEN'));
        const result = await browser.evaluate(async () => {
            const { AppClient } = window.api;
            const client = new AppClient({ TOKEN: window.tokenRequest });
            return client.simple.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const result = await browser.evaluate(async () => {
            const { AppClient } = window.api;
            const client = new AppClient({ TOKEN: undefined, USERNAME: 'username', PASSWORD: 'password' });
            return client.simple.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('complexService', async () => {
        const result = await browser.evaluate(async () => {
            const { AppClient } = window.api;
            const client = new AppClient();
            return client.complex.complexTypes({
                first: {
                    second: {
                        third: 'Hello World!',
                    },
                },
            });
        });
        expect(result).toBeDefined();
    });

    it('formData', async () => {
        const result = await browser.evaluate(async () => {
            const { AppClient } = window.api;
            const client = new AppClient();
            return client.parameters.callWithParameters('valueHeader', 'valueQuery', 'valueForm', 'valueCookie', 'valuePath', {
                prop: 'valueBody',
            });
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        try {
            await browser.evaluate(async () => {
                const { AppClient } = window.api;
                const client = new AppClient();
                const promise = client.simple.getCallWithoutParametersAndResponse();
                setTimeout(() => {
                    promise.cancel();
                }, 10);
                await promise;
            });
        } catch (e) {
            expect(e.message).toContain('The user aborted a request.');
        }
    });
}

function executeNodeTestsWithStaticClient(dir, version, client) {
    beforeAll(async () => {
        await generate(dir, version, client, false, false, false);
        await compileWithTypescript(dir);
        await server.start(dir);
    }, TIMEOUT);

    afterAll(async () => {
        await server.stop();
    }, TIMEOUT);

    function requireClient() {
        return require(`./generated/${dir}/index.js`);
    }

    it('requests token', async () => {
        const { OpenAPI, SimpleService } = requireClient();
        const tokenRequest = jest.fn().mockResolvedValue('MY_TOKEN');
        OpenAPI.TOKEN = tokenRequest;
        const result = await SimpleService.getCallWithoutParametersAndResponse();
        expect(tokenRequest.mock.calls.length).toBe(1);
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const { OpenAPI, SimpleService } = requireClient();
        OpenAPI.TOKEN = undefined;
        OpenAPI.USERNAME = 'username';
        OpenAPI.PASSWORD = 'password';
        const result = await SimpleService.getCallWithoutParametersAndResponse();
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('complexService', async () => {
        const { ComplexService } = requireClient();
        const result = await ComplexService.complexTypes({
            first: {
                second: {
                    third: 'Hello World!',
                },
            },
        });
        expect(result).toBeDefined();
    });

    it('formData', async () => {
        const { ParametersService } = requireClient();
        const result = await ParametersService.callWithParameters('valueHeader', 'valueQuery', 'valueForm', 'valueCookie', 'valuePath', {
            prop: 'valueBody',
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
}

function executeNodeTestsWithInstanceClient(dir, version, client) {
    beforeAll(async () => {
        await generate(dir, version, client, true, true, true);
        await compileWithTypescript(dir);
        await server.start(dir);
    }, TIMEOUT);

    afterAll(async () => {
        await server.stop();
    }, TIMEOUT);

    function requireClient() {
        return require(`./generated/${dir}/index.js`);
    }

    it('requests token', async () => {
        const tokenRequest = jest.fn().mockResolvedValue('MY_TOKEN');
        const { AppClient } = requireClient();
        const client = new AppClient({ TOKEN: tokenRequest });
        const result = await client.simple.getCallWithoutParametersAndResponse();
        expect(tokenRequest.mock.calls.length).toBe(1);
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const { AppClient } = requireClient();
        const client = new AppClient({ TOKEN: undefined, USERNAME: 'username', PASSWORD: 'password' });
        const result = await client.simple.getCallWithoutParametersAndResponse();
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('complexService', async () => {
        const { AppClient } = requireClient();
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

    it('formData', async () => {
        const { AppClient } = requireClient();
        const client = new AppClient();
        const result = await client.parameters.callWithParameters('valueHeader', 'valueQuery', 'valueForm', 'valueCookie', 'valuePath', {
            prop: 'valueBody',
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        try {
            const { AppClient } = require('./generated/v2/node_client/index.js');
            const client = new AppClient();
            const promise = client.simple.getCallWithoutParametersAndResponse();
            setTimeout(() => {
                promise.cancel();
            }, 10);
            await promise;
        } catch (e) {
            expect(e.message).toContain('The user aborted a request.');
        }
    });
}

module.exports = {
    executeBrowserTestsWithStaticClient,
    executeBrowserTestsWithInstanceClient,
    executeNodeTestsWithStaticClient,
    executeNodeTestsWithInstanceClient,
};
