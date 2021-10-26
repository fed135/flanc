import config from 'config';
import postgres from 'postgres';

let sql;

export function connect() {
  return postgres(config.db);
}

export function query(queryString: string, params?: any[]) {
  if (!sql) sql = connect();

  return sql(queryString, params);
}
