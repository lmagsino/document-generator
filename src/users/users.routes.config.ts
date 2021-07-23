import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './users.controller';
import express from 'express';

import UsersService from './users.service';

// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');

const SUCCESS_CODE = 200;
export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app.post('/users', async (_, res) => {
      const pdf = await UsersService.generatePdf();
      res.status(SUCCESS_CODE).send(pdf);
    });

    this.app.get('/users', async (_, res) => {
      const pdf = await UsersService.retrievePdf();
      res.status(SUCCESS_CODE).send(pdf);
    });

    return this.app;
  }
}
