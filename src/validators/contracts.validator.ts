import express from 'express';
import jwt from 'jwt-simple';

const LIST_OF_CONTRACTS = [
  'deduction_authorization', 'privacy_disclosure',
  'privacy_disclosure_eperformax', 'food_panda_deduction',
  'disclosure_statement', 'weekly_disclosure_statement',
  'promissory_note', 'weekly_promissory_note'];

function paramsList(value: unknown) {
  let params: Array<string>;
  switch (value) {
    case 'deduction_authorization':
    case 'privacy_disclosure':
    case 'privacy_disclosure_eperformax':
    case 'food_panda_deduction':
      params = ['reference_code', 'full_name', 'date_signed'];
      break;

    case 'disclosure_statement':
      params = [
        'reference_code', 'full_name', 'date_signed', 'address', 'amount',
        'processing_fee', 'bank_fee', 'interest', 'has_discount', 'discount',
        'loan_term', 'net_amount_per_payment', 'interest_clause',
        'effective_interest_rate'];
      break;

    case 'weekly_disclosure_statement':
      params = [
        'reference_code', 'full_name', 'date_signed', 'address', 'amount',
        'processing_fee', 'bank_fee', 'interest', 'has_discount', 'discount',
        'weekly_loan_term', 'net_amount_per_payment', 'interest_clause',
        'effective_interest_rate', 'dst'];
      break;

    case 'promissory_note':
    case 'weekly_promissory_note':
      params = [
        'reference_code', 'full_name', 'date_signed', 'address', 'amount',
        'amount_in_words', 'processing_fee', 'bank_fee', 'interest',
        'has_discount', 'discount', 'net_amount', 'payment_periods'];
      break;

    default:
      params = [];
      break;
  }
  return params;
}

function isEmptyString(str: unknown) {
  return (!str || str === '');
}

function validateParams(params: any) {
  const errorMessage: string[] = [];
  const missingParams: string[] = [];

  paramsList(params.type).forEach((item) => {
    if (isEmptyString(params[`${item}`])) {
      missingParams.push(item);
    }
  });

  if (missingParams.length === 0) {
    return true;
  }

  errorMessage.push(`Missing params: ${missingParams.join(', ')}`);
  return errorMessage.toString();
}

function validateType(params: any) {
  if (!(LIST_OF_CONTRACTS.includes(params.type))) {
    return 'File name does not exist';
  }
  return true;
}

function sendError(res: express.Response, message: string) {
  res.status(400).send({ error: message });
}

class ContractsValidator {
  paramsObj(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    if ('params' in req.body) {
      next();
    } else {
      sendError(res, 'Params object not found');
    }
  }

  pathAndFileName(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    if (!isEmptyString(req.body.path_name)
      && !isEmptyString(req.body.file_name)) {
      next();
    } else {
      sendError(res, 'Missing path or file name');
    }
  }

  paramsType(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    if (validateType(req.body.params) === true) {
      next();
    } else {
      sendError(res, validateType(req.body.params).toString());
    }
  }

  paramsList(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    if (validateParams(req.body.params) === true) {
      next();
    } else {
      sendError(res, validateParams(req.body.params).toString());
    }
  }

  queryFilePath(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    if (!isEmptyString(req.query.path_name)
      && !isEmptyString(req.query.file_name)) {
      next();
    } else {
      sendError(res, 'Missing path or file name');
    }
  }

  validateToken(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    try {
      const decoded = jwt.decode(req.params.token, process.env.TOKEN_SECRET!);

      if ('params' in decoded) {
        next();
      } else {
        sendError(res, 'Params object not found');
      }
    } catch (e) {
      sendError(res, 'Token Verification Failed');
    }
  }
}

export default new ContractsValidator();
