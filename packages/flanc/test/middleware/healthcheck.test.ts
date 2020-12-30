import { isConfigValid } from '../../middleware/healthcheck';

describe('[Packages | Core | Healthcheck] verify config values', () => {
  describe('Given incomplete config values', () => {
    const incompleteConfig = {};

    test('it should return false', () => {
      return expect(isConfigValid(incompleteConfig)).toBe(false);
    });
  });

  describe('Given minimally valid config values', () => {
    const completeConfig = {
      auth: { jwtSecret: '1' },
      aws: {
        glacier: { vaultName: '2' },
        rds: {
          database: '3',
          host: '4',
          password: '5',
          port: '6',
          username: '7',
        },
        region: '8',
        s3: {
          documentBucket: '26',
        },
        sqs: {
          queues: {
            fusebillInvoices: { uri: 'uri' },
            flinksRefresh: { uri: 'uri' },
            flinksPriorityRefresh: { uri: 'uri' },
            yodleeRefresh: { uri: 'uri' },
          },
        },
      },
      budgetInsight: {
        client: {
          secret: '25',
        },
      },
      database: {
        auth: {
          password: '11',
          username: '12',
        },
        host: '13',
        settings: { replicaSet: '14' },
      },
      flinks: {
        checksum: {
          encryptionKey: 'my-flinks-key',
        },
      },
      intercom: {
        token: '15',
        <project_name>UserId: '16',
        webhookSecret: '26',
      },
      newrelic: {
        license_key: 'new-relic-license-key',
      },
      scotia: {
        accountNumber: 'scotia-account-number',
        customerNumber: 'scotia-customer-number',
        institutionNumber: 'scotia-institution-number',
        transitNumber: 'scotia-transit-number',
      },
      services: {
        button: {
          query: { key: '19' },
          transactionWebhookSecret: 'button-transaction-webhook-secret',
        },
        canadaPost: {
          query: { key: '20' },
        },
        contentful: {
          spaces: {
            advisor: {
              authToken: '21',
            },
            generalSettings: {
              authToken: 'contentful-generate-settings-space-token',
            },
            perks: {
              authToken: '22',
            },
          },
        },
        equifax: {
          customerNumber: '23',
          securityCode: '24',
        },
        fusebill: {
          accountingFeeGoalId: 'accounting-fee-goal-id',
          authToken: { webhook: 'fusebill-webhook-key' },
          cpaDestinationS3Bucket: 'cpa-destination-s3-bucket',
          cpaDestinationS3Path: 'cpa-destination-s3-path',
          query: { key: 'fusebill-query-key' },
        },
        hipay: {
          auth: {
            publicUsername: 'hipay-publicUsername',
            publicPassword: 'hipay-publicPassword',
            privateUsername: 'hipay-privateUsername',
            privatePassword: 'hipay-privatePassword',
          },
        },
        jumio: {
          username: '17',
          password: '18',
        },
        plaid: {
          secret: 'plaid-secret',
        },
        treezor: {
          accessSignature: 'treezor-accessSignature',
          host: 'treezor-host',
        },
      },
      splitIo: { authorizationKey: '25' },
      treezor: {
        tarrifId: 'treezor-tarrifId',
      },
    };

    test('it should return true', () => {
      return expect(isConfigValid(completeConfig)).toBe(true);
    });
  });
});
