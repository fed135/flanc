import { createHmac } from 'crypto';
import uuidValidate from 'uuid-validate';
import { BadRequest, Unauthorized } from './errors';

interface PayloadHmacSignatureOptions {
  algo?: 'sha256'
  key: string
  payload: string | Buffer
  signature: string
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emptyStringRegex = /^\s+$/;
const ipRegex = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);

function isEmpty(value: string): boolean {
  return !value || emptyStringRegex.test(value);
}

function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

function isValidIp(ip: string): boolean {
  return ipRegex.test(ip.trim());
}

function isValidFullYear(year: string): boolean {
  return new RegExp(/^\d{4}$/).test(year);
}

function isValidMonth(month: string) {
  return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].includes(month);
}

function isValidUUID(uuid: string): boolean {
  return uuidValidate(uuid);
}

function isPositiveInteger(n: number): boolean {
  return Number.isInteger(n) && n >= 0;
}

function isFieldNotEmpty(object: any, field: string): boolean {
  return Object.hasOwnProperty.bind(object)(field) && ![undefined, null, ''].includes(object[field]);
}

function empty(value: string, key: string, context: _Context) {
  if (isEmpty(value)) throw BadRequest(`Missing \`${key}\`.`, context);
}

function isValidHmacSignature({ payload, algo, key, signature }: PayloadHmacSignatureOptions): boolean {
  return createHmac(algo || 'sha256', key)
    .update(payload)
    .digest('base64') === signature;
}

function invalidHmacSignature(options: PayloadHmacSignatureOptions, context: _Context) {
  if (!isValidHmacSignature(options)) throw Unauthorized('Invalid Signature', context);
}

function isMissingRequiredProperties(props: Array<string>, obj: Object): boolean {
  return props.some((prop) => !(prop in obj));
}

export const guards = {
  empty,
  invalidHmacSignature,
};

export const validations = {
  emailRegex,
  ipRegex,
  isEmpty,
  isFieldNotEmpty,
  isMissingRequiredProperties,
  isPositiveInteger,
  isValidEmail,
  isValidFullYear,
  isValidHmacSignature,
  isValidIp,
  isValidMonth,
  isValidUUID,
};
