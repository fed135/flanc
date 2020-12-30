import config from 'config';
import Logger from './logging';
import { modules } from './monitoring';
import Store, { HAStore, HAStoreConfig } from 'ha-store';

const storesList: { [key: string]: HAStore } = {};

function register(name: string, options: { name?: string } & HAStoreConfig) {
  options.name = name;
  if (!config.fetch.tieredCacheEnabled) {
    options.cache = null;
    options.batch = null;
    options.store = null;
  }

  const store = Store(options);
  const debug = Logger(`${name}-provider`);

  store.on('queryFailed', (evt) => debug.error(JSON.stringify(evt)));
  if (config.fetch.tieredCacheEnabled && config.fetch.tieredCacheMetricsEnabled) {
    store.on('cacheHit', () => modules?.newrelic.incrementMetric(`Custom/${name.toUpperCase()}/CacheHit`));
    store.on('cacheMiss', () => modules?.newrelic.incrementMetric(`Custom/${name.toUpperCase()}/CacheMiss`));
    store.on('coalescedHit', () => modules?.newrelic.incrementMetric(`Custom/${name.toUpperCase()}/CoalescedHit`));

    if (options.batch) {
      store.on('query', (evt) => {
        modules?.newrelic.incrementMetric(`Custom/${name.toUpperCase()}/Batch`);
        modules?.newrelic.recordMetric(`Custom/${name.toUpperCase()}/BatchSize`, evt.size);
      });
    }
  }

  storesList[name] = store;
  return store;
}

let statsTimeout = null;
function loadStatistics() {
  statsTimeout = setTimeout(loadStatistics, 10000); // Run every 10 seconds

  Object.keys(storesList).forEach((store) => {
    const value = storesList[store].size();
    modules?.newrelic.recordMetric(`Custom/${store.toUpperCase()}/Records`, value.records);
    modules?.newrelic.recordMetric(`Custom/${store.toUpperCase()}/Contexts`, value.contexts);
  });
}

if (config.fetch.tieredCacheEnabled && config.fetch.tieredCacheMetricsEnabled) {
  statsTimeout = setTimeout(loadStatistics, 10000); // Wait 10s before the initial stats check
}

function stopStatisticsPolling() {
  clearTimeout(statsTimeout);
}

export { register, stopStatisticsPolling };
