import fs from 'fs';
import pdf from 'html-pdf';
import ejs from 'ejs';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const compiled: ejs.TemplateFunction = ejs.compile(
  fs.readFileSync('./test/businesscard.html', 'utf8'),
);

const compiledHtml : string = compiled({ title: 'EJS', text: 'Hello, World!' });
// const options: any = { format: 'Letter' };
const s3Bucket: any = process.env.AWS_S3_BUCKET;

class UsersService {
  async generatePdf() {
    // Save To Local
    // pdf.create(html, options).toFile('./businesscard.pdf', function(err:
    // any, res: any) {
    //   if (err) return console.log(err);
    //   console.log(res); // { filename: '/app/businesscard.pdf' }
    // });

    // Save To Cloud storage
    // pdf.create(html).toStream((e, stream) => {
    //   stream.pipe(fs.createWriteStream('businesscards.pdf'));
    //   const params = {
    //     Key: 'businesscards.pdf',
    //     Body: stream,
    //     Bucket: s3Bucket,
    //     ContentType: 'application/pdf',
    //   };

    //   s3.upload(params, (err: any, res: any) => {
    //     if (err) console.log(err, 'err');
    //     console.log(res, 'res');
    //     return res;
    //   });
    // });

    // Upload to s3 asynchronously
    const createPDF = async (htmlFile: string) => new Promise(((resolve, reject) => {
      pdf.create(htmlFile).toStream((_, stream) => {
        const params = {
          Key: 'businesscards.pdf',
          Body: stream,
          Bucket: s3Bucket,
          ContentType: 'application/pdf',
        };

        s3.upload(params, (err: any, res: any) => {
          if (err) {
            reject(err);
          } else { resolve(res); }
        });
      });
    }));

    return await createPDF(compiledHtml);
  }

  async retrievePdf() {
    async (htmlFile: string) => new Promise(((resolve) => {
      pdf.create(htmlFile).toBuffer((_, buffer) => {
        // resolve(buffer);
        resolve(buffer.toString('base64'));
      });
    }));
  }
}

export default new UsersService();
