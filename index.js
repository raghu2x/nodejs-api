const http = require("http");
const app = require("./src/app");
const server = http.createServer(app);

const { API_PORT, PORT } = process.env;

app.listen(PORT || API_PORT, () => {
  console.log(`________________server is running at port ${API_PORT}`);
});

module.exports = app;
