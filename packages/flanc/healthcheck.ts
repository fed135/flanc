function isAppReady(app) {
  return !!app.server.ready;
}

export default function healthcheck(app) {
  app.isOk = true;

  app.get('/readycheck', function readinessEndpoint(req, res) {
    const status = (isAppReady(app)) ? 200 : 503;
    res.status(status).send(status === 200 ? 'OK' : 'NOT OK');
  });

  app.get('/healthcheck', function healthcheckEndpoint(req, res) {
    const status = app.isOk ? 200 : 503;
    res.status(status).send(status === 200 ? 'OK' : 'NOT OK');
  });
}
