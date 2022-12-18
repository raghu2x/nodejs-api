const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;

server.listen(API_PORT, () => {
  console.log(`________________server is running at port ${API_PORT}`);
});
