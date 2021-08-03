import express from 'express';
import CommonRoutesConfig from '../common/common.routes.config';
import ContractsService from './contracts.service';

// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');
const SUCCESS_CODE = 200;
const ERROR_CODE = 500;
const LIST_OF_CONTRACTS = [
  'deduction_authorization', 'privacy_disclosure', 'privacy_disclosure_eperformax',
  'food_panda_deduction', 'disclosure_statement', 'weekly_disclosure_statement',
  'promissory_note', 'weekly_promissory_note'];

function paramsList(value: any) {
  let params: Array<string>;
  switch (value) {
    case 'deduction_authorization':
    case 'privacy_disclosure':
    case 'privacy_disclosure_eperformax':
    case 'food_panda_deduction':
      params = ['reference_code', 'full_name', 'date_signed'];
      break;

    case 'disclosure_statement':
      params = ['reference_code', 'full_name', 'date_signed', 'address', 'amount',
        'processing_fee', 'bank_fee', 'interest', 'has_discount', 'discount',
        'loan_term', 'net_amount_per_payment', 'interest_clause', 'effective_interest_rate'];
      break;

    case 'weekly_disclosure_statement':
      params = ['reference_code', 'full_name', 'date_signed', 'address', 'amount', 'processing_fee',
        'bank_fee', 'interest', 'has_discount', 'discount', 'loan_term', 'net_amount_per_payment',
        'interest_clause', 'effective_interest_rate', 'dst'];
      break;

    case 'promissory_note':
    case 'weekly_promissory_note':
      params = ['reference_code', 'full_name', 'date_signed', 'address', 'amount', 'amount_in_words', 'processing_fee',
        'bank_fee', 'interest', 'has_discount', 'discount', 'net_amount', 'payment_periods'];
      break;

    default:
      params = [];
      break;
  }
  return params;
}

function isEmpty(str: string) {
  return (!str || str === '');
}

function validateParams(body: any) {
  const errorMessage: any = [];
  const missingParams: any = [];

  if (!(LIST_OF_CONTRACTS.includes(body.type))) {
    errorMessage.push('File name does not exist');
  }

  paramsList(body.type).forEach((item) => {
    if (isEmpty(body[`${item}`])) {
      missingParams.push(item);
    }
  });

  if (missingParams.length !== 0) {
    errorMessage.push(`Missing params: ${missingParams.join(', ')}`);
  }

  if (errorMessage.length !== 0) {
    return errorMessage.join(', ');
  }
  return true;
}

export default class ContractsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ContractsRoutes');
  }

  configureRoutes() {
    this.app.post('/contracts', async (req, res) => {
      const { body } = req;

      try {
        if (validateParams(body) !== true) {
          return res.status(ERROR_CODE).send(validateParams(body));
        }
        const contract = new ContractsService(body, body.type, body.reference_code);
        const results = await contract.generatePdf();
        return res.status(SUCCESS_CODE).send(results);
      } catch (e) {
        return res.status(ERROR_CODE).send(e.message);
      }
    });
    // this.app.get('/contracts', async (_, res) => {
    //   const pdf = await ContractsService.retrievePdf();
    //   res.status(SUCCESS_CODE).send(pdf);
    // });

    return this.app;
  }
}
