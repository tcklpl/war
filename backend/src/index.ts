import express from 'express';
import path from 'path';

const server = express();
const port = 3333;

server.use(express.static(path.join(__dirname, "..", "..", "frontend", "out")));

console.log(`Listening on *:${port}`);
server.listen(port);