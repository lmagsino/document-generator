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
  const referenceCode = params.reference_code;
  const type = capitalizeType(params.type);

  return `${referenceCode} ${type}`;
}

class ContractsService {
  upload(req: express.Request) {
    const compiledHtml = DocumentsService.compileHtml(req.body);
    const pathName: string = String(req.body.path_name);
    const fileName: string = String(req.body.file_name);
    const title: string = getTitle(req.body.params);

    return DocumentsService.uploadPdf({ pathName, fileName, title },
      compiledHtml);
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
