import express from 'express';
import CommonRoutesConfig from './common.routes.config';
import ContractsController from '../controllers/contracts.controller';
import ContractsValidator from '../validators/contracts.validator';
import AuthService from '../services/auth.service';

export default class ContractsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ContractsRoutes');
  }

  configureRoutes() {
    this.app.post('/contracts', AuthService.authenticateRequest, [
      ContractsValidator.validateType,
      ContractsValidator.validateParams,
      ContractsController.postPdf,
    ]);

    this.app.get('/get-contract', AuthService.authenticateRequest, [
      ContractsController.getPdf,
    ]);

    return this.app;
  }
}
