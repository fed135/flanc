import { agent } from 'supertest';
import config from 'config';

export const <project_name>ApiDirect = agent(process.env.<project_name>_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.host}`);

export const <project_name>Api = agent(process.env.<project_name>_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.gateway.host}`);

export const <project_name>ApiEU = agent(process.env.<project_name>_API_URL || `${config.gateway.https ? 'https://' : 'http://'}${config.gateway.host.replace('.ca', '.eu')}`);
