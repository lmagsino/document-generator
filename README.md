# advance-document-generator
Advance's Document Generator

## Technologies
* Typescript
* NodeJs
* ExpressJs
* AWS-SDK



## Development Setup

### Setup NodeJs
1. Install Homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. Install NodeJs: `brew install node`
  
### Create .env file
```
CLIENT_ID=54a87668-f4ba-11eb-9a03-0242ac130003
CLIENT_SECRET=c1fb2ccc4a6ae256dc51dd3232fb222baea29b98784721820e192fba127a219ac565eb75649e79f731d60912d5a87efee2f73c8d425b2835f1022b10e0fe8463
```

### Run the server
1. Install dependencies: `npm install`
2. Run the server: `npm start`

## Endpoints
### `POST` /contracts - *Generates PDF and uploads to S3*
```
// Sample body params request:
{
  "params": {
    "type": "deduction_authorization",
    "reference_code": "ABCDE1234",
    "full_name": "Test User123",
    "date_signed": "28 July 2021"
  },
  "path_name": "advance-doc-gen-bucket/documents/deduction_authorizations",
  "file_name": "deduction_authorization_ABCDE1234_2021-08-11_13-26-49-549.pdf"
}
```

### `GET` /contracts/get_url - *Retrieves signed URL of S3 Object*
```
// Sample query params request:
path_name=advance-doc-gen-bucket/documents/deduction_authorizations
file_name=deduction_authorization_ABCDE1234_2021-08-11_13-26-49-549.pdf
```


### `For Authentication:`
```
// Add Basic Auth:
Username: 54a87668-f4ba-11eb-9a03-0242ac130003
Password: c1fb2ccc4a6ae256dc51dd3232fb222baea29b98784721820e192fba127a219ac565eb75649e79f731d60912d5a87efee2f73c8d425b2835f1022b10e0fe8463
```
