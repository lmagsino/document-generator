import express from 'express';
import CommonRoutesConfig from './common.routes.config';
import AuthService from '../services/auth.service';

export default class HealthcheckRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'HealthcheckRoutes');
  }

  configureRoutes() {
    this.app.get('/healthcheck', (_, res) => {
      const healthcheck: object = {
        uptime: `${process.uptime()} seconds`,
        message: 'Up and running!',
        timestamp: new Date().toLocaleString(),
      };

      try {
        res.send(healthcheck);
      } catch (e: any) {
        res.status(e.code || 500).send(e);
      }
    });

    this.app.get(
      '/healthcheck/auth', AuthService.authenticateRequest, (_, res) => {
        const healthcheck: object = {
          uptime: `${process.uptime()} seconds`,
          message: 'Up and running!',
          timestamp: new Date().toLocaleString(),
        };

        try {
          res.send(healthcheck);
        } catch (e: any) {
          res.status(e.code || 500).send(e);
        }
      },
    );

    return this.app;
  }
}
