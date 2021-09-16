import aws from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';
import PdfService from './pdf.service';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getFileName(str: string) {
  return str.substring(str.lastIndexOf('/') + 1);
}

class DocumentsService {
  uploadPdf(file: {
    pathName: string, fileName: string, title: string, compiledHtml: string
  }, browser: any) {
    const uploadPdf = (htmlFile: string) => new Promise(((resolve, reject) => {
      PdfService.createStream(htmlFile, browser).then((stream) => {
        PdfService.addTitle(stream, file.title).then((pdfStream) => {
          const params = {
            Key: file.fileName,
            Body: pdfStream,
            Bucket: file.pathName,
            ContentType: 'application/pdf',
          };

          s3.upload(params, (err: unknown, res: any) => {
            if (err) {
              reject(err);
            } else { resolve(getFileName(res.key)); }
          });
        });
      });
    }));
    return uploadPdf(file.compiledHtml);
  }

  retrieveUrl(pathName: string, fileName: string) {
    const url = new Promise(((resolve, reject) => {
      const params = {
        Bucket: pathName,
        Key: fileName,
        Expires: 3600,
      };

      s3.getSignedUrl('getObject', params, (err: unknown, res: unknown) => {
        if (err) {
          reject(err);
        } else { resolve(res); }
      });
    }));
    return url;
  }

  retrievePdfBuffer(html : {compiled: string, title: string}, browser: any) {
    const pdfBuffer = (htmlFile: string) => new Promise(((resolve) => {
      PdfService.createStream(htmlFile, browser).then((stream) => {
        PdfService.addTitle(stream, html.title).then((pdfStream) => {
          resolve(Buffer.from(pdfStream));
        });
      });
    }));
    return pdfBuffer(html.compiled);
  }

  compileHtml(object: any) {
    const htmlPath: string = `./pdfs/${object.params.type}.html`;
    const rawFile: string = fs.readFileSync(htmlPath, 'utf8');

    const compiler: ejs.TemplateFunction = ejs.compile(rawFile);
    return compiler(object.params);
  }
}

export default new DocumentsService();
