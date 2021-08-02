import { CommonRoutesConfig } from '../common/common.routes.config';
// import ContractsController from './contracts.controller';
import express from 'express';
import ContractsService from './contracts.service';

// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');
const SUCCESS_CODE = 200;
const ERROR_CODE = 500;
const LIST_OF_CONTRACTS = [
  'deduction_authorization', 'privacy_disclosure', 'privacy_disclosure_eperformax',
  'food_panda_deduction', 'disclosure_statement', 'weekly_disclosure_statement',
  'promissory_note', 'weekly_promissory_note'];

export class ContractsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ContractsRoutes');
  }

  configureRoutes() {
    this.app.post('/contracts', async (req, res) => {
      const type = req.body.type;

      try {
        if (!(LIST_OF_CONTRACTS.includes(type))) {
          return res.status(ERROR_CODE).send('File name does not exist');
        }
        const results = await ContractsService.generatePdf(req);
        res.status(SUCCESS_CODE).send(results);
      } catch(e) {
        res.status(ERROR_CODE).send(e.message);
      }
    });
    // this.app.get('/contracts', async (_, res) => {
    //   const pdf = await ContractsService.retrievePdf();
    //   res.status(SUCCESS_CODE).send(pdf);
    // });

    return this.app;
  }
}
