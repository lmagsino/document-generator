import fs from 'fs';
import ejs from 'ejs';
import DocumentsService from './documents.service';

export default class ContractsService {
  public body: any;

  public type: string;

  public ref: string;

  constructor(body: any, type: string, ref: string) {
    this.body = body;
    this.type = type;
    this.ref = ref;
  }

  async generatePdf() {
    const compiled = ejs.compile(fs.readFileSync(`./pdfs/${this.type}.html`, 'utf8'));
    const compiledHtml = compiled(this.body);

    return DocumentsService(this.ref, this.type, compiledHtml);
  }
}
