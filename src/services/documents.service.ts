import express from 'express';
import pdf from 'html-pdf';
import aws from 'aws-sdk';

const options: any = { format: 'Letter', border: '25mm' };
const s3Bucket: any = process.env.AWS_S3_BUCKET;
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class DocumentsService {
  async uploadPdf(req: express.Request, compiledHtml: any) {
    const createPdf = async (htmlFile: string) => new Promise(((resolve, reject) => {
      pdf.create(htmlFile, options).toStream((_, stream) => {
        const filename = `${req.body.reference_code}_${req.body.type}.pdf`;
        const params = {
          Key: filename,
          Body: stream,
          Bucket: s3Bucket,
          ContentType: 'application/pdf',
        };

        s3.upload(params, (err: any, res: any) => {
          if (err) {
            reject(err);
          } else { resolve(res.Location); }
        });
      });
    }));
    return createPdf(compiledHtml);
  }
}

export default new DocumentsService();
