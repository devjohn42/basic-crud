import { router } from './routes';
import express from 'express';

const server = express();

server.use(express.json());
server.use(router);

export { server };
