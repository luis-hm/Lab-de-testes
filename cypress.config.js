const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true, // vídeos em cypress/videos e prints de falha em cypress/screenshots (evidências)
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    env: {
      // senha pública do ambiente de demonstração da Sauce Labs
      PASSWORD: 'secret_sauce',
    },
  },
})
