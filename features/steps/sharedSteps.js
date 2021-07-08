const { Given, When, Then } = require('cucumber');
const { clickElement, llenarCampo, assertText, obtenerTexto, buscarElemento } = require('../support/functions');
const { assert } = require('chai');
const { log } = require(`${process.cwd()}/logger`);
const urls = require(`${process.cwd()}/urls.json`);
require(`${process.cwd()}/features/support/functions.js`);
const { Actions } = require('selenium-webdriver');

Given(/^Abro la pagina "(.*)"$/, async function (web) {

    await this.driver.manage().deleteAllCookies();

    try {
        await this.driver.get(urls[this.env[web]][web]);
        await log.info('Ejecutando la prueba en el ambiente: ' + this.env[web]);
        await log.info('abriendo la pagina: ' + urls[this.env[web]][web]);
        //await this.driver.sleep(10000);

    } catch (error) {
        if (error.message.includes("ERR_CONNECTION_TIMED_OUT")) {
            await log.error("Error de timeout al intentar abrir la página");

        } else {
            await log.error('No se pudo abrir la página. Revisar los archivos urls y config');
        }
        await assert.fail('Falló porque no se pudo abrir la página');
        await log.error(error);
        await process.exit();
    }

});

Given(/^Leo los datos de "(.*)"$/, async function (json) {
    this.page = require(`${process.cwd()}/features/pages/${json}.json`);
});

When(/^Hago click en "(.*)"$/, async function (elementKey) {
    await clickElement(this.page, elementKey);
});


When(/^Hago click en "(.*)" con Executor$/, async function (elementKey) {
    await clickElementWithExecutor(this.page, elementKey);
});

When(/^Lleno el campo "(.*)" con "(.*)"$/, async function (elementKey, texto) {
    await llenarCampo(this.page, elementKey, texto);
});

Then(/^Verifico que el campo "(.)" contenga el texto "(.)"$/, async function (elementKey, texto) {
    await assertText(this.page, elementKey, texto);

});
