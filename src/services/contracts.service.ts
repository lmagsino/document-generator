import express from 'express';
import jwt from 'jwt-simple';
import DocumentsService from './documents.service';

function capitalizeType(str: string) {
  const words: any[] = str.split('_');
  const type: any[] = [];

  words.forEach((word) => {
    const upperCase: string = word.charAt(0).toUpperCase() + word.slice(1);
    type.push(upperCase);
  });

  return type.join(' ');
}

function getTitle(params: any) {
  return `${params.reference_code} ${capitalizeType(params.type)}`;
}

class ContractsService {
  upload(req: express.Request) {
    const compiledHtml = DocumentsService.compileHtml(req.body);
    const pathName: string = String(req.body.path_name);
    const fileName: string = String(req.body.file_name);
    const title: string = getTitle(req.body.params);

    const doc = DocumentsService.uploadPdf(
      { pathName, fileName, title }, compiledHtml,
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

  display(req: express.Request) {
    const decoded: string = jwt.decode(
      req.params.token, process.env.TOKEN_SECRET!,
    );

    const compiledHtml: string = DocumentsService.compileHtml(decoded);
    const title: string = getTitle(req.query);

    return DocumentsService.retrievePdfBuffer(compiledHtml, title);
  }
}

export default new ContractsService();
