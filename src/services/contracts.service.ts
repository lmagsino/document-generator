import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import DocumentsService from './documents.service';

class ContractsService {
  async upload(req: express.Request) {
    const file = fs.readFileSync(`./pdfs/${req.body.params.type}.html`, 'utf8');
    const compiled = ejs.compile(file);
    const compiledHtml = compiled(req.body.params);

    return DocumentsService.uploadPdf(req, compiledHtml);
  }

  async retrieveUrl(req: express.Request) {
    return DocumentsService.retrieveFile(req);
  }
}

export default new ContractsService();
