const { setWorldConstructor, setDefaultTimeout, setDefinitionFunctionWrapper } = require('cucumber');
const seleniumWebdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
const { getDriver } = require(`${process.cwd()}/driver`);
const argv = require('minimist')(process.argv.slice(2));
const config = require(`${process.cwd()}/config.json`);
const { log } = require(`${process.cwd()}/logger`);

function ThisWorld({ attach }) {
 
  this.page = '';
  this.argv = argv;
  setDefaultTimeout('90000');
  this.driver= getDriver();
  this.env = config.env;
  this.data = new Map();
  this.screenshots = 'onFail';
  this.attach = attach;
};

setWorldConstructor(ThisWorld);

setDefinitionFunctionWrapper((fn) => {
  return async function () {
    await fn.apply(this, arguments);
    if (this.screenshots !== undefined && this.screenshots.toLowerCase().includes("always")) {
      try {
        await this.attach(await this.driver.takeScreenshot(), "image/png");
      } catch (ex) {
        log.error(ex);
      }
    }
  };
});