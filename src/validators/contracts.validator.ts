import express from 'express';

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

  paramsList(body.type).forEach((item) => {
    if (isEmpty(body[`${item}`])) {
      missingParams.push(item);
    }
  });

  if (missingParams.length === 0) {
    return true;
  }

  errorMessage.push(`Missing params: ${missingParams.join(', ')}`);
  return errorMessage.toString();
}

function validateType(type: any) {
  if (!(LIST_OF_CONTRACTS.includes(type))) {
    return 'File name does not exist';
  }
  return true;
}

class ContractsValidator {
  async validateType(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (validateType(req.body.params.type) === true) {
      next();
    } else {
      res.status(400).send({ error: validateType(req.body.params.type) });
    }
  }

  async validateParams(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (validateParams(req.body.params) === true) {
      next();
    } else {
      res.status(400).send({ error: validateParams(req.body.params) });
    }
  }
}

export default new ContractsValidator();
