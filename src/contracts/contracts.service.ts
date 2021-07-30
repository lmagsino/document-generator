import fs from 'fs';
import pdf from 'html-pdf';
import ejs from 'ejs';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const options: any = { format: 'Letter', border: '25mm' };
const s3Bucket: any = process.env.AWS_S3_BUCKET;

class ContractsService {
  async generatePdf(req : any) {
    const body = req.body;
    const type = body.type;
    const ref = body.reference_code;

    try {
      const compiled: ejs.TemplateFunction =
        ejs.compile(fs.readFileSync(`./pdfs/${type}.html`, 'utf8'));

      // TODO: change to class?
      const compiledHtml : string =
        compiled({
          reference_code: ref, full_name: body.full_name, date_signed: body.date_signed,
          amount: body.amount, processing_fee: body.processing_fee,
          bank_fee: body.bank_fee, interest: body.interest, loan_term: body.loan_term,
          discount: body.discount, discount_present: body.discount_present,
          net_amount_per_payment: body.net_amount_per_payment,
          effective_interest_rate:  body.effective_interest_rate,
          amount_in_words: body.amount_in_words, has_discount: body.has_discount,
          address: body.address, interest_clause: body.interest_clause,
          dst: body.dst, net_amount: body.net_amount, payment_periods: body.payment_periods});

      // Upload to s3 asynchronously
      const createPDF = async (htmlFile: string) => new Promise(((resolve, reject) => {
        pdf.create(htmlFile, options).toStream((_, stream) => {
          const filename = `${ref}_${type}.pdf`;
          const params = {
            Key: filename,
            Body: stream,
            Bucket: s3Bucket,
            ContentType: 'application/pdf',
          };

          s3.upload(params, (err: any, res: any) => {
            if (err) { reject(err); }
            else { resolve(res); }
          });
        });
      }));

      return await createPDF(compiledHtml);
    } catch (error) {
      return (error.message);
    }
  }

  // async retrievePdf() {
  //   const compiled: ejs.TemplateFunction =
  //     ejs.compile(fs.readFileSync('./test/businesscard.html', 'utf8'));

  //   const compiledHtml : string = compiled({ title: 'EJS', text: 'Hello, World!' });

  //   const createPDF = async (htmlFile: string) => new Promise(((resolve, reject) => {
  //     pdf.create(htmlFile).toBuffer((_, buffer) => {
  //       resolve(buffer.toString('base64'));
  //     });
  //   }));

  //   return await createPDF(compiledHtml);
  // }
}

export default new ContractsService();
