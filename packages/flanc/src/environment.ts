import config from 'config';

type Environment = 'production' | 'dev';

export function isRegion(region: string): boolean {
  return config.aws.region.indexOf(region) > -1;
}

export function isEnvironment(env: Environment): boolean {
  return (process.env?.NODE_ENV || []).indexOf(env) > -1;
}
