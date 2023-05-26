require('dotenv').config();

// const Server = require('./models/server');
const { Server } = require('./models');

const server = new Server();

server.listen();