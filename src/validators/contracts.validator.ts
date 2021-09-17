import express from 'express';
import jwt from 'jwt-simple';

const LIST_OF_CONTRACTS = [
  'deduction_authorization', 'privacy_disclosure',
  'privacy_disclosure_eperformax', 'food_panda_deduction',
  'disclosure_statement', 'weekly_disclosure_statement',
  'promissory_note', 'weekly_promissory_note'];

const PARAMS_MISSING = 'Params object not found';
const TOKEN_FAILED = 'Token Verification Failed';
const NAME_MISSING = 'Missing path or file name';
const TYPE_MISSING = 'File type does not exist';
const TITLE_MISSING = 'Missing document title';
const PARAMS_OBJECT = 'params';

function paramsList(value: unknown) {
  let params: Array<string> = [
    'reference_code', 'full_name', 'date_signed',
  ];

  const disclosureDefaultParams: Array<string> = [
    'address', 'amount', 'processing_fee', 'bank_fee', 'interest',
    'has_discount', 'discount', 'net_amount_per_payment', 'interest_clause',
    'effective_interest_rate',
  ];

  const promissoryDefaultParams : Array<string> = [
    'address', 'amount', 'amount_in_words', 'processing_fee', 'bank_fee',
    'interest', 'has_discount', 'discount', 'net_amount', 'payment_periods',
  ];

  switch (value) {
    case 'disclosure_statement':
      params = params.concat(disclosureDefaultParams);
      params.push('loan_term');
      break;
    case 'weekly_disclosure_statement':
      params = params.concat(disclosureDefaultParams);
      params.push('weekly_loan_term', 'dst');
      break;
    case 'promissory_note':
    case 'weekly_promissory_note':
      params = params.concat(promissoryDefaultParams);
  }

  return params;
}

function isEmptyString(str: unknown) {
  return (!str || str === '');
}

function validateRequiredParams(params: any, errors: any) {
  paramsList(params.type).forEach((item) => {
    if (isEmptyString(params[`${item}`])) {
      errors.push(`${item} does not exist`);
    }
  });
}

function hasValidDocType(type: string) {
  return LIST_OF_CONTRACTS.includes(type);
}

function validateDocType(type: string, errors: any) {
  if (!hasValidDocType(type)) {
    errors.push(TYPE_MISSING);
  }
}

function sendError(res: express.Response, message: string) {
  res.status(400).send({ errors: message });
}

function hasParams(params: any) {
  return PARAMS_OBJECT in params;
}

function validateParamsObject(object: any, errors: any) {
  if (hasParams(object)) {
    validateDocType(object.params.type, errors);
    validateRequiredParams(object.params, errors);
  } else {
    errors.push(PARAMS_MISSING);
  }
}

function hasValidName(query: any) {
  return !(isEmptyString(query.path) || isEmptyString(query.file));
}

function validateName(nameQuery: any, errors: any) {
  if (!hasValidName(nameQuery)) {
    errors.push(NAME_MISSING);
  }
}

function validateTitle(titleQuery: any, errors: any) {
  if (isEmptyString(titleQuery.title)) {
    errors.push(TITLE_MISSING);
  }
}

class ContractsValidator {
  validateParams(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    const errors: any = [];

    const nameQuery = {
      path: req.body.path_name,
      file: req.body.file_name,
    };

    validateParamsObject(req.body, errors);
    validateName(nameQuery, errors);
    validateTitle({ title: req.body.title }, errors);

    return errors.length > 0 ? sendError(res, errors) : next();
  }

  validateFileAndPathName(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) : void {
    const errors: any = [];

    const nameQuery = {
      path: req.query.path_name,
      file: req.query.file_name,
    };

    validateName(nameQuery, errors);

    return errors.length > 0 ? sendError(res, errors) : next();
  }

  validateDocumentTitle(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) : void {
    const errors: any = [];

    validateTitle({ title: req.query.title }, errors);

    return errors.length > 0 ? sendError(res, errors) : next();
  }

  validateToken(
    req: express.Request, res: express.Response, next: express.NextFunction,
  ) {
    try {
      const decoded = jwt.decode(req.params.token, process.env.TOKEN_SECRET!);

      if (hasParams(decoded)) {
        next();
      } else {
        sendError(res, PARAMS_MISSING);
      }
    } catch (e) {
      sendError(res, TOKEN_FAILED);
    }
  }
}

export default new ContractsValidator();
