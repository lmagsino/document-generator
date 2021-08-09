import express from 'express';
import ContractsService from '../services/contracts.service';

class ContractsController {
  async postPdf(req: express.Request, res: express.Response) {
    try {
      const pdf = await ContractsService.generatePdf(req);
      res.status(200).send(pdf);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}

export default new ContractsController();
