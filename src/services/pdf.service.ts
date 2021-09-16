import puppeteer from 'puppeteer';
import express from 'express';

import { PDFDocument } from 'pdf-lib';

const options: {} = {
  format: 'a4',
  printBackground: true,
  margin: {
    left: '2.5cm', top: '1.5cm', right: '2.5cm', bottom: '2.5cm',
  },
};

class PdfService {
  static async setBrowser(req: express.Request) {
    if (req.app.locals.browser === undefined) {
      req.app.locals.browser = await puppeteer.launch();
    }
  }

  static async createStream(htmlFile: any, browser: any) {
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.setContent(htmlFile);
    const pdf = await page.pdf(options);
    await page.close();

    return pdf;
  }

  static async addTitle(pdf: any, title: string) {
    const pdfLib = await PDFDocument.load(pdf);
    pdfLib.setTitle(title);
    const titledPdf = await pdfLib.save();

    return titledPdf;
  }
}

export default PdfService;
