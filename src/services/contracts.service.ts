import express from 'express';
import jwt from 'jwt-simple';
import DocumentsService from './documents.service';

class ContractsService {
  upload(req: express.Request) {
    const compiledHtml = DocumentsService.compileHtml(req.body);
    const pathName: string = String(req.body.path_name);
    const fileName: string = String(req.body.file_name);

    return DocumentsService.uploadPdf({ pathName, fileName }, compiledHtml);
  }

  retrieveUrl(req: express.Request) {
    const pathName: string = String(req.query.path_name);
    const fileName: string = String(req.query.file_name);

    return DocumentsService.retrieveUrl(pathName, fileName);
  }

  generateToken(req: express.Request) {
    const object = req.body;
    object.exp = (Date.now() / 1000) + 3600;

    return jwt.encode(object, process.env.TOKEN_SECRET!);
  }

  displayPdf(req: express.Request) {
    const decoded: string = jwt.decode(
      req.params.token, process.env.TOKEN_SECRET!,
    );

    const compiledHtml: string = DocumentsService.compileHtml(decoded);

    return DocumentsService.createDisplay(compiledHtml);
  }
}

export default new ContractsService();
