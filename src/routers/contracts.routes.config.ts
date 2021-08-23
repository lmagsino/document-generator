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
      ContractsValidator.paramsObj,
      ContractsValidator.pathAndFileName,
      ContractsValidator.paramsType,
      ContractsValidator.paramsList,
      ContractsController.upload,
    ]);

    this.app.get('/contracts/url', AuthService.authenticateRequest, [
      ContractsValidator.queryFilePath,
      ContractsController.retrieveUrl,
    ]);

    return this.app;
  }
}
