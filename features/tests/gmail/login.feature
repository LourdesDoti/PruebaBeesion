@PRUEBA
Feature: GMAIL


    Scenario: Iniciar Sesion
        Given Abro la pagina "gmail"
        And Leo los datos de "gmail"
        When Lleno el campo "CorreoElectronico" con "pruebabeesionqa@gmail.com"
        And Hago click en "Siguiente"
        And Lleno el campo "Contraseña" con "LYPCG12345"
        And Hago click en "Siguiente"
  