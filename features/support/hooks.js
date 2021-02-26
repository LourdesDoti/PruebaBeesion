const { BeforeAll, Before, After, AfterAll } = require('cucumber');
const { log } = require(`${process.cwd()}/logger`);
const config = require(`${process.cwd()}/config.json`);
const { getDriver } = require(`${process.cwd()}/driver.js`);
var driver = getDriver();

Before ( async function(scenario) {

    await log.info('Empezando a ejecutar: ' + scenario.pickle.name);
    

})


After ( async function (scenario) {
  if (scenario.result.status ==='failed'){
    await log.error ("Resultado del escenario: " + scenario.result.status)
  }else {
    await log.info ("Resultado del escenario: " +scenario.result.status)
  }
})

AfterAll ( async function(){
  await driver.close();
  await log.info( 'cerrando el navegador.')
})


//***********           this After always needs to be at the bottom of this file           ***********//
After( async function (scenario) {
    if (this.screenshots.toLowerCase().includes('onfail') &&
          scenario.result.status.toLowerCase().includes('fail')) {
      await this.attach(await this.driver.takeScreenshot(), 'image/png');
    }
  });
