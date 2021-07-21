import fs from 'fs';
import pdf from 'html-pdf';
import ejs from 'ejs';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const compiled: ejs.TemplateFunction =
    ejs.compile(fs.readFileSync('./test/businesscard.html', 'utf8'));

const html : string = compiled({ title: 'EJS', text: 'Hello, World!' });
// const options: any = { format: 'Letter' };
const s3Bucket: any = process.env.AWS_S3_BUCKET;

class UsersService {
  async generatePdf() {
    // TODO: Save To Local
    // pdf.create(html, options).toFile('./businesscard.pdf', function(err:
    // any, res: any) {
    //   if (err) return console.log(err);
    //   console.log(res); // { filename: '/app/businesscard.pdf' }
    // });


    // TODO: Save To Cloud storage
    pdf.create(html).toStream((e, stream) => {
      stream.pipe(fs.createWriteStream('businesscards.pdf'));
      const params = {
        Key: 'businesscards.pdf',
        Body: stream,
        Bucket: s3Bucket,
        ContentType: 'application/pdf',
      };

      s3.upload(params, (err: any, res: any) => {
        if (err) console.log(err, 'err');
        console.log(res, 'res');
      });
    });
  }
}

export default new UsersService();
