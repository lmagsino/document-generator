import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';

import ContractsRoutes from './routers/contracts.routes.config';

const app = express();
const server = http.createServer(app);
const routes = [];
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
  ),
};

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

app.use(expressWinston.logger(loggerOptions));

routes.push(new ContractsRoutes(app));

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
