import express from 'express';
import CommonRoutesConfig from '../common/common.routes.config';
import ContractsController from './contracts.controller';

const SUCCESS_CODE = 200;
const ERROR_CODE = 500;

export default class ContractsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ContractsRoutes');
  }

  configureRoutes() {
    this.app.post('/contracts', async (req, res) => {
      const { body } = req;
      const contractsController = new ContractsController(body);
      const results : any = await contractsController.validateAndGeneratePdf();

      if (results.status === 'error') {
        return res.status(ERROR_CODE).send(results.message);
      }
      return res.status(SUCCESS_CODE).send(results);
    });
    return this.app;
  }
}
