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
      ContractsValidator.validateParams,
      ContractsController.upload,
    ]);

    this.app.get('/contracts/url', AuthService.authenticateRequest, [
      ContractsValidator.validateFileAndPathName,
      ContractsController.retrieveUrl,
    ]);

    this.app.post('/contracts/token', AuthService.authenticateRequest, [
      ContractsValidator.validateParams,
      ContractsController.generateToken,
    ]);

    this.app.get('/contracts/:token', [
      ContractsValidator.validateDocumentTitle,
      ContractsValidator.validateToken,
      ContractsController.show,
    ]);

    return this.app;
  }
}
