import express from 'express';
import ContractsService from '../services/contracts.service';

class ContractsController {
  async upload(req: express.Request, res: express.Response) {
    try {
      const pdf: unknown = await ContractsService.upload(req);
      res.status(200).send({ file_name: pdf });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  async retrieveUrl(req: express.Request, res: express.Response) {
    try {
      const url: unknown = await ContractsService.retrieveUrl(req);
      res.status(200).send({ url });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  generateToken(req: express.Request, res: express.Response) {
    try {
      const token: unknown = ContractsService.generateToken(req);
      res.status(200).send({ token });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  async show(req: express.Request, res: express.Response) {
    try {
      const buffer: unknown = await ContractsService.retrieveBuffer(req);

      res.header('Content-type', 'application/pdf');
      res.send(buffer);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}

export default new ContractsController();
