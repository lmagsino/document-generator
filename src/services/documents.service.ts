import pdf from 'html-pdf';
import aws from 'aws-sdk';

const options: {} = { format: 'Letter', border: '25mm' };
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
      pdf.create(htmlFile, options).toStream((_, stream) => {
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

  async retrieveFile(pathName: string, fileName: string) {
    const file = new Promise(((resolve, reject) => {
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
    return file;
  }
}

export default new DocumentsService();
