import express from 'express';
import ContractsService from '../services/contracts.service';

class ContractsController {
  async upload(req: express.Request, res: express.Response) {
    try {
      const pdf = await ContractsService.upload(req);
      res.status(200).send({ file_name: pdf });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  async retrieveUrl(req: express.Request, res: express.Response) {
    try {
      const url = await ContractsService.retrieveUrl(req);
      res.status(200).send({ url });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}

export default new ContractsController();
