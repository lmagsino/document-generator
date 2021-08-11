import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import DocumentsService from './documents.service';

class ContractsService {
  async generatePdf(req: express.Request) {
    const compiled = ejs.compile(fs.readFileSync(`./pdfs/${req.body.params.type}.html`, 'utf8'));
    const compiledHtml = compiled(req.body.params);

    return DocumentsService.uploadPdf(req, compiledHtml);
  }

  async retrievePdf(req: express.Request) {
    return DocumentsService.retrieveFile(req);
  }
}

export default new ContractsService();
