import express from 'express';
import pdf from 'html-pdf';
import aws from 'aws-sdk';

const options: any = { format: 'Letter', border: '25mm' };
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getFileName(str: String) {
  return str.substring(str.lastIndexOf('/') + 1);
}

class DocumentsService {
  async uploadPdf(req: express.Request, compiledHtml: any) {
    const createPdf = async (htmlFile: string) => new Promise(((resolve, reject) => {
      pdf.create(htmlFile, options).toStream((_, stream) => {
        const params = {
          Key: req.body.file_name,
          Body: stream,
          Bucket: req.body.path_name,
          ContentType: 'application/pdf',
        };

        s3.upload(params, (err: any, res: any) => {
          if (err) {
            reject(err);
          } else { resolve(getFileName(res.key)); }
        });
      });
    }));

    return createPdf(compiledHtml);
  }

  async retrieveFile(req: any) {
    const file = new Promise(((resolve, reject) => {
      const params = {
        Bucket: req.body.path_name,
        Key: req.body.file_name,
        Expires: 3600,
      };

      s3.getSignedUrl('getObject', params, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else { resolve(res); }
      });
    }));
    return file;
  }
}

export default new DocumentsService();
