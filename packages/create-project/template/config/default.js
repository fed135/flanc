require('dotenv').config();
const path = require('path');
const budgetInsightUtils = require('./utils/budget-insight');

module.exports = {
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    expiresAt: 60 * 60 * 24,
  },
  aws: {
    glacier: {
      apiVersion: '2012-06-01',
      partSize: 1024 * 1024, // 1Mb chunks
      vaultName: process.env.AWS_GLACIER_VAULT,
    },
    rds: {
      database: process.env.AWS_RDS_DATABASE,
      host: process.env.AWS_RDS_HOST,
      password: process.env.AWS_RDS_PASSWORD,
      port: process.env.AWS_RDS_PORT,
      username: process.env.AWS_RDS_USERNAME,
    },
    region: process.env.AWS_REGION,
    s3: {
      apiVersion: '2006-03-01',
      documentBucket: process.env.S3_BUCKET_DOCUMENTS,
    },
    sqs: {
      batchMessageLimit: 10,
      queues: {
        accountNotifications: {
          uri: process.env.SQS_ACCOUNT_NOTIFICATIONS_URI,
        },
        creditCheck: {
          uri: process.env.SQS_CREDIT_CHECK_URI,
          sqsOptions: {
            pollIntervalMs: 1000 * 60 * 60,
          },
        },
        flinksRefresh: {
          uri: process.env.SQS_FLINKS_BANK_REFRESH_URI,
        },
        flinksPriorityRefresh: {
          uri: process.env.SQS_FLINKS_PRIORITY_BANK_REFRESH_URI,
        },
        fusebillInvoices: {
          uri: process.env.SQS_FUSEBILL_INVOICES_URI,
          sqsOptions: {
            forceDelete: true,
            pollerType: 'sequential',
            maxNumberOfMessages: 1,
          },
        },
        yodleeRefresh: {
          uri: process.env.SQS_YODLEE_BANK_REFRESH_URI,
        },
      },
    },
  },
  budgetInsight: {
    client: {
      id: budgetInsightUtils.mapClientId(),
      secret: process.env.BUDGET_INSIGHT_CLIENT_SECRET,
    },
    host: budgetInsightUtils.mapHost(),
  },
  database: {
    auth: {
      password: process.env.MONGO_PASSWORD,
      username: process.env.MONGO_USERNAME,
    },
    db: '<project_name>DevServer',
    host: process.env.MONGO_URI,
    settings: {
      authSource: process.env.MONGO_AUTH_SOURCE || '',
      connectTimeoutMS: 10000,
      keepAlive: true,
      poolSize: 2,
      readPreference: 'secondaryPreferred',
      replicaSet: process.env.MONGO_REPLICASET,
      retryWrites: true,
      ssl: !!process.env.MONGO_SSL_ENABLED && process.env.MONGO_SSL_ENABLED === 'true',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: 'majority',
    },
  },
  debug: {
    stackSize: 4,
  },
  fetch: {
    requestTimeout: 20000,
    tieredCacheEnabled: true,
  },
  flinks: {
    checksum: {
      encryptionKey: process.env.FLINKS_CHECKSUM_ENCRYPTION_KEY,
      salt: '<project_name>-ftw!',
    },
  },
  host: 'localhost:9001',
  https: false,
  gateway: {
    host: 'localhost:9001',
    https: false,
  },
  i18next: {
    translationFilePath: path.resolve(__dirname, '..', 'locales/{{lng}}/{{ns}}.json'),
  },
  intercom: {
    adminId: '2052624', // Ana Rodrigues from CS
    advisorTeamId: '3756945', // Advisor Team
    <project_name>UserId: process.env.INTERCOM_<project_name>_USER_ID,
    segmentIds: {
      '360InvitedUsers': process.env.INTERCOM_SEGMENT_360_INVITED_USERS,
      '2XCashback': process.env.INTERCOM_SEGMENT_2X_CASHBACK,
    },
    token: process.env.INTERCOM_TOKEN_<project_name>_API,
    webhookSecret: process.env.INTERCOM_WEBHOOK_SECRET,
  },
  newrelic: {
    agent_enabled: !!(process.env.NEW_RELIC_ENABLED),
    app_name: `LOCAL <project_name>${(process.env.AWS_REGION === 'ca-central-1') ? '' : ' EU'}`,
    browser_monitoring: {
      enabled: false,
    },
    error_collector: {
      ignore_status_codes: [400, 401, 403, 404, 405],
    },
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
      enabled: false,
    },
  },
  photoId: {
    maxFailedAttempts: 2,
  },
  port: 9001,
  proxies: {
    '/admin': { target: 'https://map.<project_name>.ai' },
    '/origin': { target: 'https://api.<project_name>.ai' },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ?? 6379,
  },
  response: {
    clientCacheTimeout: 3600, // 1 hour
  },
  rest: {
    maxRelationshipDepth: 4,
  },
  scotia: {
    accountNumber: process.env.SCOTIA_ACCOUNT_NUMBER,
    customerNumber: process.env.SCOTIA_CUSTOMER_NUMBER,
    institutionNumber: process.env.SCOTIA_INSTITUTION_NUMBER,
    transitNumber: process.env.SCOTIA_TRANSIT_NUMBER,
  },
  segment: {
    writeKey: process.env.SEGMENT_WRITE_KEY || 'abc',
  },
  services: {
    budgetInsight: {
      client: {
        id: budgetInsightUtils.mapClientId(),
        secret: process.env.BUDGET_INSIGHT_CLIENT_SECRET,
      },
      host: budgetInsightUtils.mapHost(),
    },
    button: {
      basePath: '/v1',
      host: 'https://pubapi.usebutton.com',
      offersPath: '/offers',
      query: {
        key: process.env.BUTTON_API_KEY,
      },
      transactionWebhookSecret: process.env.BUTTON_TRANSACTION_WEBHOOK_SECRET,
    },
    canadaPost: {
      basePath: '/AddressComplete/Interactive',
      host: 'https://ws1.postescanada-canadapost.ca',
      query: {
        key: process.env.CANADA_POST_API_KEY,
      },
      suggestPath: '/Find/v2.10/json3.ws',
      tokenizePath: '/RetrieveFormatted/v2.10/json3.ws',
    },
    contentful: {
      environment: 'staging',
      host: 'http://cdn.contentful.com',
      spaces: {
        advisor: {
          id: 'n88kqhlawul1',
          authToken: process.env.CONTENTFUL_ACCESS_TOKEN_ADVISOR,
        },
        dynamic: {
          id: '4bddoui6ykbr',
          authToken: process.env.CONTENTFUL_ACCESS_TOKEN_DYNAMIC,
        },
        generalSettings: {
          id: 'ild2g92o96kj',
          authToken: process.env.CONTENTFUL_ACCESS_TOKEN_GENERAL_SETTINGS,
        },
        perks: {
          id: '6fhmjs7l5ros',
          authToken: process.env.CONTENTFUL_ACCESS_TOKEN_PERKS,
        },
      },
    },
    debtProduct: {
      dynamicPaymentsPath: '/dynamic-payments',
      host: process.env.DEBT_PRODUCT_HOST,
    },
    equifax: {
      customerNumber: process.env.EQUIFAX_CUSTOMER_NUMBER,
      environment: 'A01PKSS',
      host: 'https://uat.equifax.ca',
      securityCode: process.env.EQUIFAX_SECURITY_CODE,
    },
    firebase: {
      auth: {
        authUri: 'https://accounts.google.com/o/oauth2/auth',
        authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
        clientC509CertUrl: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yp50j%40<project_name>-react-native.iam.gserviceaccount.com',
        clientEmail: 'firebase-adminsdk-yp50j@<project_name>-react-native.iam.gserviceaccount.com',
        clientId: '117870285248278382794',
        privateKey: process.env.FIREBASE_SECRET_KEY,
        privateKeyId: '4d32717f98f740ede7f4b907191f2fd86896d8ef',
        projectId: '<project_name>-react-native',
        tokenUri: 'https://oauth2.googleapis.com/token',
        type: 'service_account',
      },
      host: 'https://<project_name>-react-native.firebaseio.com',
    },
    forestMap: {
      host: process.env.FOREST_MAP_URI,
      basePath: '/api/v0',
      paths: {
        processTransfer: '/process-transfer',
      },
    },
    fusebill: {
      authToken: {
        webhook: process.env.FUSEBILL_WEBHOOK_KEY,
      },
      accountingFeeGoalId: process.env.ACCOUNTING_FEE_GOAL_ID,
      basePath: '/v1',
      cpaDestinationS3Bucket: process.env.S3_BUCKET_FUSEBILL_FEE_CPA,
      cpaDestinationS3Path: process.env.S3_PATH_FUSEBILL_FEE_CPA,
      host: 'https://secure.fusebill.com',
      paths: {
        customerActivation: '/customerActivation',
        customerBillingSetting: '/customerbillingsetting',
        customerCancellation: '/customercancellation',
        customerHold: '/customerhold',
        customers: '/customers',
        invoices: '/Invoices',
        refunds: '/Refunds',
        invoiceSummaries: '/invoiceSummaries',
        invoiceWriteoff: '/Invoices/Writeoff',
        payments: '/payments',
        planFamilies: '/planFamilies',
        plans: '/Plans',
        reverseCharges: '/ReverseCharges',
        subscriptions: '/subscriptions',
        subscriptionsActivation: '/SubscriptionsActivation',
      },
      query: {
        key: process.env.FUSEBILL_API_KEY,
      },
      planCodes: {
        CAD: {
          advantage: 'advantageplan',
          basic: 'basicplan',
          36012: '36012',
          36015: '36015',
        },
        EUR: {
          advantage: 'advantageeu',
        },
      },
      pauseMillisForOtherInstancesProcessing: 5 * 60 * 1000,
      processBillingFlagTTL: 3 * 60 * 60,
    },
    hipay: {
      auth: {
        publicUsername: process.env.HIPAY_PUBLIC_USERNAME,
        publicPassword: process.env.HIPAY_PUBLIC_PASSWORD,
        privateUsername: process.env.HIPAY_PRIVATE_USERNAME,
        privatePassword: process.env.HIPAY_PRIVATE_PASSWORD,
      },
      headers: {
        Authorization: `BASIC ${Buffer.from(`${process.env.HIPAY_PRIVATE_USERNAME}:${process.env.HIPAY_PRIVATE_PASSWORD}`).toString('base64')}`,
        Accept: 'application/json',
      },
      host: '',
      tokenUrl: process.env.HIPAY_TOKEN_URL,
      paymentUrl: `${process.env.HIPAY_PAYMENT_URL}/v1`,
      callbackUrl: 'http://localhost:9001/html/bank-linking/auth-callback/v1/treezor-hipay/3DS',
      corporateUserId: process.env.HIPAY_CORPORATE_USER_ID,
      corporateWalletId: process.env.HIPAY_CORPORATE_WALLET_ID,
    },
    hubspot: {
      host: 'https://api.hubapi.com',
      hapikey: process.env.HUBSPOT_ACCESS_TOKEN,
      paths: {
        contacts: '/crm/v3/objects/contacts/',
        deals: '/crm/v3/objects/deals',
        engagement: '/engagements/v1/engagements',
        association: '/crm-associations/v1/associations',
        fileManager: '/filemanager/api/v3/files',
      },
    },
    intercom: {
      host: 'https://api.intercom.io',
      headers: {
        Authorization: `Bearer ${process.env.INTERCOM_TOKEN_<project_name>_API}`,
      },
    },
    jumio: {
      username: process.env.JUMIO_USERNAME,
      password: process.env.JUMIO_PASSWORD,
      headers: {
        Authorization: 'Basic ' + Buffer.from(process.env.JUMIO_USERNAME + ':' + process.env.JUMIO_PASSWORD).toString('base64'),
      },
    },
    plaid: {
      host: 'https://sandbox.plaid.com',
      webview: 'https://cdn.plaid.com/link/v2/stable/link.html',
      clientID: '5eb8cd0ba74a160011e487f0',
      secret: process.env.PLAID_SECRET,
      env: 'https://sandbox.plaid.com',
    },
    treezor: {
      host: 'https://sandbox.treezor.com/v1',
      accessSignature: process.env.TREEZOR_ACCESS_TOKEN,
      headers: {
        Authorization: `Bearer ${process.env.TREEZOR_ACCESS_TOKEN}`,
      },
    },
    typeform: {
      webhookSecret: process.env.TYPEFORM_WEBHOOK_SECRET,
      billToken: process.env.TYPEFORM_BILL_NEGOTIATION_TOKEN,
      host: 'https://api.typeform.com/',
      paths: {
        forms: '/forms',
      },
    },
    valet: {
      host: 'https://www.bankofcanada.ca/valet',
      observations: '/observations',
    },
  },
  shutdown: {
    appKill: 1000,
    serverClose: 100,
  },
  splitIo: {
    authorizationKey: process.env.SPLIT_IO_AUTHORIZATION_KEY,
  },
  treezor: {
    clientId: process.env.TREEZOR_CLIENT_ID,
    tariffId: process.env.TREEZOR_TARIFF_ID,
  },
  typeform: {
    webhookSecret: process.env.TYPEFORM_WEBHOOK_SECRET,
  },
};
