import { agent } from 'supertest';
import config from 'config';

export const mokaApiDirect = agent(process.env.MOKA_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.host}`);

export const mokaApi = agent(process.env.MOKA_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.gateway.host}`);

export const mokaApiEU = agent(process.env.MOKA_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.gateway.host.replace('.ca', '.eu')}`);
