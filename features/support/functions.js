const { getDriver } = require(`${process.cwd()}/driver.js`);
var driver = getDriver();
const { assert } = require('chai');
const { By, Key, until, WebElement } = require('selenium-webdriver');
const { ExceptionHandler, exceptions } = require('winston');
const { log } = require(`${process.cwd()}/logger`);
const CANT_REINTENTOS_DEFAULT = 4;
var cantReintentos = CANT_REINTENTOS_DEFAULT;

async function buscarElemento(json, element, reintentos) {

    if (reintentos != undefined) {
        cantReintentos = reintentos;
    };

    var elementoEncontrado = false;
    var nroReintento = 1;
    var errorTrace;

    while ((!elementoEncontrado) && (nroReintento <= cantReintentos)) {

        try {
            if (nroReintento > 1) {
                await driver.sleep(4000);
            }
            await log.info('Localizando elemento: ' + element);
            var webElement = await driver.wait(until.elementLocated(By.xpath(json[element].valor)), 5000, 5000, 5000);
            elementoEncontrado = true;
            await log.info('Se localizó el elemento ' + element + ' exitosamente');

        } catch (error) {
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element);
                await log.info('Número de intento ' + nroReintento);

            } else {
                await log.error(error);
            }

            nroReintento++;
        }
    }

    if (!elementoEncontrado) {
        return "ELEMENT_NOT_FOUND";
    } else {
        return webElement;
    }
}

async function obtenerTexto(json, element) {

    var elementoEncontrado = false;
    var nroReintento = 1;
    var errorTrace;
    while ((!elementoEncontrado) && (nroReintento <= cantReintentos)) {
        try {
            await log.info('Localizando elemento: ' + element);
            var webElement = await driver.wait(until.elementLocated(By.xpath(json[element].valor)), 5000, 5000, 5000);
            await driver.sleep(4500);
            var textoExtraido = await webElement.getText();
            await log.info('Se extrajo el texto' + textoExtraido + ' del elemento ' + element);
            elementoEncontrado = true;

        } catch (error) {
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element);
                await log.info('Número de intento ' + nroReintento);

            } else {
                await log.error(error);
            }

            nroReintento++;
        }

    }

    if (!elementoEncontrado) {
        switch (errorTrace.name) {
            case 'TimeoutError':
                await assert.fail(' no se pudo localizar al elemento ' + element + '. Error: ' + errorTrace +
                    '. REVISAR EL LOCATOR'
                );
                break;

            default:
                await assert.fail('No se pudo llenar los datos al elemento ' + element + '. Error: ' + errorTrace);
                break;
        }

    } else {
        return textoExtraido;
    }

}

async function clickElement(json, element) {

    var webElement = await buscarElemento(json, element);
    if (webElement != 'ELEMENT_NOT_FOUND') {
        try {
            await driver.sleep(1500);
            await webElement.click();
            await log.info('se hizo click en el elemento ' + element);
        } catch (error) {
            try {
                await log.info( ' error al hacer click. reintentando por segunda vez...');
                await driver.sleep(3000);
                await webElement.click();
            } catch (error) {
                try {
                    await log.info( ' error al hacer click. reintentando por tercera vez...');
                    await driver.sleep(3000);
                    await webElement.click();
                } catch (error) {
                    await log.error('hubo un error al hacer click. Reintentando con el executeScript...');
                    if ((error.name).includes('NotInteractable')) {
                        await driver.executeScript('arguments[0].click()', webElement);
                        await log.info('busco el elemento de vuelta para ver si se le pudo hacer click o no');
                        var webElement2 = await buscarElemento(json, element, 1);
                        if (webElement2 != 'ELEMENT_NOT_FOUND') {
                            await log.warn('El elemento sigue estando. Muy probablemente, hubo un error y no se le hizo click. Tomar esto como una advertencia, es probable que el proceso haya fallado en este paso. Mientras el proceso va a continuar');
                        } else {
                            await log.info('Bien! El elemento ya no se encuentra. Supongo que al haber hecho click el elemento ya desapareció');
                        }
                        cantReintentos = CANT_REINTENTOS_DEFAULT;
                    }
                }
            }
        }
    } else {
        await assert.fail('no se pudo localizar el elemento');
    }


}

async function llenarCampo(json, element, texto) {

    var webElement = await buscarElemento(json, element);
    if (webElement != 'ELEMENT_NOT_FOUND') {
        try {
            await driver.sleep(8000);
            await webElement.clear();
            await webElement.sendKeys(texto);
            await log.info('se escribio el texto ' + texto + ' en el elemento ' + element);
        } catch (error) {
            await log.error('hubo un error al escribir en el elemento ' + element + '. Reintentando con el executeScript...')
            if ((error.name).includes('NotInteractable')) {
                await driver.executeScript("arguments[0].value='" + texto + "';", webElement);
                var textoActual = await webElement.getText();
                if (textoActual != texto) {
                    await assert.fail('no se pudo escribir el texto ' + texto + ' en el elemento ' + element);
                } else {
                    await log.info('Al haber reintentado, se escribió el texto ' + textoActual + ' en el elemento ' + element);
                }
            }
        }
    } else {
        await assert.fail('no se pudo localizar el elemento');
    }


}


async function assertText(json, element, texto) {
    await driver.sleep(8000);
    var webElement = await buscarElemento(json, element);
    if (webElement != 'ELEMENT_NOT_FOUND') {
        try {
            await driver.sleep(4000);
            var textoExtraido = await webElement.getText();
            await log.info('Se extrajo el texto' + textoExtraido + ' del elemento = ' + element);
            await assert.isTrue(textoExtraido.includes(texto), 'AssertionError. Texto extraido: ' + textoExtraido + '. Texto esperado: ' + texto);
        } catch (error) {
            await log.error('hubo un error al extraer el texto del elemento ' + element + '.');
            await assert.fail('no se pudo extraer el texto ' + texto + ' en el elemento ' + element);
        }
    } else {
        await assert.fail('no se pudo localizar el elemento');
    }

}











module.exports = {
    clickElement,
    llenarCampo,
    assertText,
    obtenerTexto,
    buscarElemento
}