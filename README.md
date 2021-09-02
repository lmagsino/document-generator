# advance-document-generator
Advance's Document Generator

## Technologies
* Typescript
* NodeJs
* ExpressJs
* AWS-SDK

## Prerequisites
* NodeJs
* yarn

## Development Setup
* Install dependencies: `yarn`
* Get a copy of `.env` file
* Run the server: `yarn start`

## Sample `.env` file
```
AWS_S3_BUCKET=advance-documents
AWS_ACCESS_KEY_ID=DFSDFUIJSDKFJSDFJISDJF
AWS_SECRET_ACCESS_KEY=qXmQgnYf0asdfi9ksjdfljasdifj1akGlAytBW48jzD

CLIENT_ID=78989sdf-f4ba-11eb-9a03-asdfasdf
CLIENT_SECRET=askdjfi_sidfjksdfkj
TOKEN_SECRET=EJlsidjfisdfjisdjf

PORT = 3030
```

### `For Authentication:`
* Basic Auth
* Username = CLIENT_ID 
* Password = CLIENT_SECRET

## Endpoints
### `POST` /contracts - *Generates PDF and uploads to S3*
### `POST` /contracts/token - *Retrieves token. Use for browser rendering*
```
// Sample body params request:
{
  "params": {
    "type": "deduction_authorization",
    "reference_code": "ABCDE1234",
    "full_name": "Test User123",
    "date_signed": "28 July 2021"
  },
  "path_name": "advance-documents/deduction_authorizations",
  "file_name": "deduction_authorization_ABCDE1234_2021-08-11_13-26-49-549.pdf"
}
```

### `GET` /contracts/url - *Retrieves signed URL of S3 Object*
```
// Sample query params request:
path_name=advance-documents/deduction_authorizations
file_name=deduction_authorization_ABCDE1234_2021-08-11_13-26-49-549.pdf
```

### `GET` /contracts/:token - *Render pdf document to browser*
