import basicAuth from 'express-basic-auth';

const CLIENT_ID: string = process.env.CLIENT_ID! ?? '';
const CLIENT_SECRET: string = process.env.CLIENT_SECRET! ?? '';

// TODO: Add validation if CLIENT_ID is blank
export default class AuthService {
  static clientCredentials = (() => {
    const client: { [username: string] : string } = {};
    client[CLIENT_ID] = CLIENT_SECRET;

    return client;
  }
  )();

  static authenticateRequest =
    basicAuth({
      users: AuthService.clientCredentials,
    })
}
