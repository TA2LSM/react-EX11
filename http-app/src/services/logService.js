import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

function init() {
  Sentry.init({
    dsn: 'https://ff74f778be79421a87ba1b564412036a@o1302232.ingest.sentry.io/6539356',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default { init, log };
