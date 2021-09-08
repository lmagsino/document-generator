import aws from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

const options: {} = {
  format: 'a4',
  printBackground: true,
  margin: {
    left: '2.5cm', top: '2.5cm', right: '2.5cm', bottom: '2.5cm',
  },
};

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getFileName(str: string) {
  return str.substring(str.lastIndexOf('/') + 1);
}

async function createBuffer(htmlFile: any) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulateMediaType('screen');
  await page.setContent(htmlFile);
  const pdf = await page.pdf(options);
  await browser.close();

  return pdf;
}

class DocumentsService {
  uploadPdf(file: {pathName: string, fileName: string},
    compiledHtml: string) {
    const createPdf = (htmlFile: string) => new Promise(((resolve, reject) => {
      createBuffer(htmlFile).then((stream) => {
        const params = {
          Key: file.fileName,
          Body: stream,
          Bucket: file.pathName,
          ContentType: 'application/pdf',
        };

        s3.upload(params, (err: unknown, res: any) => {
          if (err) {
            reject(err);
          } else { resolve(getFileName(res.key)); }
        });
      });
    }));
    return createPdf(compiledHtml);
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

  createDisplay(compiledHtml: string) {
    const displayBuffer = (htmlFile: string) => new Promise(((resolve) => {
      resolve(createBuffer(htmlFile));
    }));
    return displayBuffer(compiledHtml);
  }

  compileHtml(object: any) {
    const htmlPath: string = `./pdfs/${object.params.type}.html`;
    const rawFile: string = fs.readFileSync(htmlPath, 'utf8');

    const compiler: ejs.TemplateFunction = ejs.compile(rawFile);
    return compiler(object.params);
  }
}

export default new DocumentsService();
