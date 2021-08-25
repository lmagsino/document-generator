import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import DocumentsService from './documents.service';

class ContractsService {
  async upload(req: express.Request) {
    const htmlPath: string = `./pdfs/${req.body.params.type}.html`;
    const rawFile: string = fs.readFileSync(htmlPath, 'utf8');

    const compiled: ejs.TemplateFunction = ejs.compile(rawFile);
    const compiledHtml: string = compiled(req.body.params);

    const pathName: string = String(req.body.path_name);
    const fileName: string = String(req.body.file_name);

    return DocumentsService.uploadPdf({ pathName, fileName }, compiledHtml);
  }

  async retrieveUrl(req: express.Request) {
    const pathName: string = String(req.query.path_name);
    const fileName: string = String(req.query.file_name);

    return DocumentsService.retrieveFile(pathName, fileName);
  }
}

export default new ContractsService();
