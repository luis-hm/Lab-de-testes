const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Relatório HTML com prints embutidos: cypress/reports/index.html (evidência para o relatório final)
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Swag Labs — Testes Automatizados',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  video: true, // vídeos em cypress/videos (úteis para a apresentação)
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    env: {
      // senha pública do ambiente de demonstração da Sauce Labs
      PASSWORD: 'secret_sauce',
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
})
