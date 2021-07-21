// import debug from 'debug';
import express from 'express';
import UsersService from './users.service';

// const log: debug.IDebugger = debug('app:users-controller');
const SUCCESS_CODE = 200;

class UsersController {
  async generatePdf(req: express.Request, res: express.Response) {
    const pdf = await UsersService.generatePdf();
    res.status(SUCCESS_CODE).send(pdf);
  }
}

export default new UsersController();
