import { createConnection } from 'postgres';
import config from 'config';

let instance;

function connect() {
    return createConnection(config.db);
}

async function query(queryString: string, params?: any[]) {
    if (!instance) await connect();

    instance.query()
}