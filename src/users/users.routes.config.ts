import express from 'express';
import jwt from 'jwt-simple';

import CommonRoutesConfig from '../routers/common.routes.config';
import UsersService from './users.service';
import AuthService from '../services/auth.service';

// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');

const SUCCESS_CODE = 200;
export default class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app.post('/users', async (_, res) => {
      const pdf = await UsersService.generatePdf();
      res.status(SUCCESS_CODE).send(pdf);
    });

    // Get Base64 of pdf (URL Safe)
    this.app.get('/get-encoded-pdf', async (req, res) => {
      const pdf: any = await UsersService.retrievePdf();
      const encodedPdf = encodeURIComponent(pdf);
      res.status(SUCCESS_CODE).send(encodedPdf);
    });

    // Render pdf from Base64 (URL Safe)
    this.app.get('/render-pdf/:id', async (req, res) => {
      const pdf = Buffer.from(decodeURIComponent(req.params.id), 'base64');

      res.header('Content-type', 'application/pdf');
      res.status(SUCCESS_CODE).send(pdf);
    });

    // Get jwt of pdf (Base64)
    this.app.get('/get-encoded-pdf-jwt', async (req, res) => {
      const pdf: any = await UsersService.retrievePdf();
      const token = jwt.encode({ pdfFile: pdf }, 'advance');
      res.status(SUCCESS_CODE).send(token);
    });

    // Render pdf from jwt (Base64)
    this.app.get('/render-pdf-jwt/:id', async (req, res) => {
      const decoded = jwt.decode(req.params.id, 'advance');
      const pdf = Buffer.from(decoded.pdfFile, 'base64');

      res.header('Content-type', 'application/pdf');
      res.send(pdf);
    });

    // Get jwt of pdf params
    this.app.post('/get-token', AuthService.authenticateRequest, async (req, res) => {
      const token = jwt.encode(req.body, 'advance');
      res.status(SUCCESS_CODE).send(token);
    });

    // Render pdf from jwt
    this.app.get('/render-pdf-token/:id', async (req, res) => {
      const decoded = jwt.decode(req.params.id, 'advance');
      console.log(decoded);
      const pdfFile: any = await UsersService.retrievePdf();
      const pdf = Buffer.from(pdfFile, 'base64');

      res.header('Content-type', 'application/pdf');
      res.send(pdf);
    });

    return this.app;
  }
}
