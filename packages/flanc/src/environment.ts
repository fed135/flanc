import config from 'config';

type Environment = 'production' | 'dev';

export function isEnvironment(env: Environment): boolean {
  return (process.env?.NODE_ENV || []).indexOf(env) > -1;
}
