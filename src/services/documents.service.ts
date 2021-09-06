import aws from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';

const wkhtmltopdf = require('wkhtmltopdf');

const options: {} = {
  pageSize: 'a4',
  marginTop: '25mm',
  marginBottom: '25mm',
  marginRight: '25mm',
  marginLeft: '25mm',
};

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getFileName(str: String) {
  return str.substring(str.lastIndexOf('/') + 1);
}

class DocumentsService {
  async uploadPdf(file: {pathName: string, fileName: string},
    compiledHtml: string) {
    const createPdf = async (htmlFile: string) => new Promise(((resolve, reject) => {
      const doc = wkhtmltopdf(htmlFile, options);
      const params = {
        Key: file.fileName,
        Body: doc,
        Bucket: file.pathName,
        ContentType: 'application/pdf',
      };

      s3.upload(params, (err: unknown, res: any) => {
        if (err) {
          reject(err);
        } else { resolve(getFileName(res.key)); }
      });
    }));
    return createPdf(compiledHtml);
  }

  async retrieveUrl(pathName: string, fileName: string) {
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
    return wkhtmltopdf(compiledHtml, options);
  }

  compileHtml(object: any) {
    const htmlPath: string = `./pdfs/${object.params.type}.html`;
    const rawFile: string = fs.readFileSync(htmlPath, 'utf8');

    const compiler: ejs.TemplateFunction = ejs.compile(rawFile);
    return compiler(object.params);
  }
}

export default new DocumentsService();
