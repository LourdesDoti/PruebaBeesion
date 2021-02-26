const { Given, When, Then } = require('cucumber');
const { clickElement , llenarCampo } = require('../support/functions');
const { log } = require(`${process.cwd()}/logger`);
const urls  = require(`${process.cwd()}/urls.json`);
require(`${process.cwd()}/features/support/functions.js`);

Given(/^Abro la pagina "(.*)"$/, async function (web) {

    try {
        await this.driver.get(urls[this.env[web]][web]);
        await log.info ('Ejecutando la prueba en el ambiente: '+ this.env[web]);
        await log.info('abriendo la pagina: ' + urls[this.env[web]][web]) ;
        
    } catch (error) {
        if (error.message.includes("ERR_CONNECTION_TIMED_OUT")){
            await log.error("Error de timeout al intentar abrir la página");
            
        }else{
            await log.error('No se pudo abrir la página. Revisar los archivos urls y config');
        }
        await log.error(error);
        await process.exit();
    }

});

Given(/^Leo los datos de "(.*)"$/ , async function(json){
     this.page = require(`${process.cwd()}/features/pages/${json}.json`);
});

Given(/^Hago click en "(.*)"$/ , async function(elementKey){
    await clickElement( this.page , elementKey);
});

Given(/^Lleno el campo "(.*)" con "(.*)"$/ , async function(elementKey, texto){
    await llenarCampo( this.page , elementKey, texto);
});