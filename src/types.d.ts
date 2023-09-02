declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}

declare module 'xss-clean' {
  const value: Function;

  export default value;
}

declare module 'flutterwave-node-v3';
declare module 'passport';
declare module 'passport-google-oauth20';
