// ------------ Start up the chrome server ------------
const seleniumWebdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const config = require(`${process.cwd()}/config.json`);
const { log } = require(`${process.cwd()}/logger`);


let driver;



async function buildDriver() {

    switch (config.mode) {
        case "local": {
            log.info(`Abriendo un chrome de forma local`);
            driver = new seleniumWebdriver.Builder().forBrowser("chrome").build();
            await driver.manage().window().maximize(); 
            break;
        };
        case "server": {
            log.info(`Abriendo un chrome en modo server en la siguiente url : ${config.serverUrl}`);
            driver = new seleniumWebdriver.Builder().usingServer(config.serverUrl).forBrowser("chrome").build(); 
            await driver.manage().window().maximize(); 
            break;
        };
        default: {
            log.error("El archivo config necesita un valor correcto en el campo mode:Puede ser local o server.   Se encontró: "+ config.mode);
            log.error("Cerrando el proceso");
            process.exit();
          }
    }
    await driver.manage().deleteAllCookies();

}

buildDriver();

const getDriver = function () {
    return driver;
};

module.exports = {

    getDriver

};