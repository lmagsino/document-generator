import fs from 'fs';
import ejs from 'ejs';
import { DocumentsService } from './documents.service';

class ContractsService {
  async generatePdf(req : any) {
    const body = req.body;
    const type = body.type;
    const ref = body.reference_code;

    const compiled = ejs.compile(fs.readFileSync(`./pdfs/${type}.html`, 'utf8'));
    const compiledHtml = compiled(body);

    return await DocumentsService(ref, type, compiledHtml);
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
