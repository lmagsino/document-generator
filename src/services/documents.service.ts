import aws from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

const options: {} = {
  format: 'a4',
  printBackground: true,
  margin: {
    left: '2.5cm', top: '1.5cm', right: '2.5cm', bottom: '2.5cm',
  },
};

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getFileName(str: string) {
  return str.substring(str.lastIndexOf('/') + 1);
}

async function createStream(htmlFile: any) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulateMediaType('screen');
  await page.setContent(htmlFile);
  const pdf = await page.pdf(options);
  await browser.close();

  return pdf;
}

async function addTitle(pdf: any, title: string) {
  const pdfLib = await PDFDocument.load(pdf);
  pdfLib.setTitle(title);
  const titledPdf = await pdfLib.save();

  return titledPdf;
}

class DocumentsService {
  uploadPdf(file: {pathName: string, fileName: string, title: string},
    compiledHtml: string) {
    const uploadPdf = (htmlFile: string) => new Promise(((resolve, reject) => {
      createStream(htmlFile).then((stream) => {
        addTitle(stream, file.title).then((pdfStream) => {
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
    return uploadPdf(compiledHtml);
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

  retrievePdfBuffer(compiledHtml: string, title: string) {
    const pdfBuffer = (htmlFile: string) => new Promise(((resolve) => {
      createStream(htmlFile).then((stream) => {
        addTitle(stream, title).then((pdfStream) => {
          resolve(Buffer.from(pdfStream));
        });
      });
    }));
    return pdfBuffer(compiledHtml);
  }

  compileHtml(object: any) {
    const htmlPath: string = `./pdfs/${object.params.type}.html`;
    const rawFile: string = fs.readFileSync(htmlPath, 'utf8');

    const compiler: ejs.TemplateFunction = ejs.compile(rawFile);
    return compiler(object.params);
  }
}

export default new DocumentsService();
