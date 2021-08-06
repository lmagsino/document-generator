import express from 'express';
import CommonRoutesConfig from '../common/common.routes.config';
import ContractsController from './contracts.controller';
import ContractsValidator from './contracts.validator';

export default class ContractsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ContractsRoutes');
  }

  configureRoutes() {
    this.app.post('/contracts', [
      ContractsValidator.validateType,
      ContractsValidator.validateParams,
      ContractsController.postPdf,
    ]);

    return this.app;
  }
}
