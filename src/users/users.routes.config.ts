import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './users.controller';
import express from 'express';
// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');

const SUCCESS = 200;
export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app.route(`/users`)
        .get((req: express.Request, res: express.Response) => {
          //   debugLog(UsersController.generatePdf());
          res.status(SUCCESS).send(`List of users`);
        })
        .post(UsersController.generatePdf);

    this.app.route(`/users/:userId`)
        .all(
          (req: express.Request, res: express.Response,
              next: express.NextFunction) => {
            next();
          })
        .get((req: express.Request, res: express.Response) => {
          res.status(SUCCESS).send(`GET requested for id ${req.params.userId}`);
        })
        .put((req: express.Request, res: express.Response) => {
          res.status(SUCCESS).send(`PUT requested for id ${req.params.userId}`);
        })
        .patch((req: express.Request, res: express.Response) => {
          res.status(SUCCESS).send(`PATCH requested for id ${req.params.userId}`);
        })
        .delete((req: express.Request, res: express.Response) => {
          res.status(SUCCESS).send(`DELETE requested for id ${req.params.userId}`);
        });

    return this.app;
  }
}
