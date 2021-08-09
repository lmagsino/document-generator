import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import DocumentsService from './documents.service';

class ContractsService {
  async generatePdf(req: express.Request) {
    const compiled = ejs.compile(fs.readFileSync(`./pdfs/${req.body.type}.html`, 'utf8'));
    const compiledHtml = compiled(req.body);

    return DocumentsService(req, compiledHtml);
  }
}

export default new ContractsService();
