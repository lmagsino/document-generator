import express from 'express';
import jwt from 'jwt-simple';
import DocumentsService from './documents.service';
import PdfService from './pdf.service';

class ContractsService {
  async upload(req: express.Request) {
    const compiledHtml = DocumentsService.compileHtml(req.body);
    const pathName: string = String(req.body.path_name);
    const fileName: string = String(req.body.file_name);
    const title: string = String(req.body.title);

    await PdfService.setBrowser(req);

    const doc = DocumentsService.uploadPdf(
      {
        pathName, fileName, title, compiledHtml,
      }, req.app.locals.browser,
    );

    return doc;
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

  async display(req: express.Request) {
    const decoded: string = jwt.decode(
      req.params.token, process.env.TOKEN_SECRET!,
    );

    await PdfService.setBrowser(req);

    const compiled: string = DocumentsService.compileHtml(decoded);
    const title: string = String(req.query.title);
    const htmlParams: any = { compiled, title };

    const pdfBuffer = DocumentsService.retrievePdfBuffer(
      htmlParams, req.app.locals.browser,
    );

    return pdfBuffer;
  }
}

export default new ContractsService();
