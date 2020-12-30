import config from 'config';

config.services.canadaPost.query.key = 'some-canada-post-key';
config.auth.jwtSecret = 'some-fake-key';
config.aws.glacier.partSize = 1024 * 256;
config.typeform.webhookSecret = 'abcde';
config.treezor.tariffId = '147';

process.env.TEST_MODE = 'test';

process.on('unhandledRejection', (err: Error) => process.stderr.write(`unhandledRejection: ${err.stack}\n`));
