module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ]
  },
  deploy: [
    "UserChain"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};


