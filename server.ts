import http from 'http';
import devIp from 'dev-ip';
import { noop } from 'lodash'

import app from './app'
import { config, Environment } from './config'
import { log } from './src/utils/log.utils'

/* eslint-disable no-console */
// set hostname, port and server
const hostname = (config.STATIC_IP && config.ENV === Environment.Development && devIp()) || undefined
const port = normalizePort(config.PORT)

app.set('port', port)

const server = http.createServer(app)

if (
  config.FORCE_SYNC &&
  (config.ENV === Environment.Development || config.ENV === Environment.Test)
) {
  runLocal();
} else {
  runProduction();
} 

async function runProduction() {
  log.info('Running in production mode');
  startServer();
}

async function runLocal() {
  log.info('Running in local mode');
  startServer();
}

function startServer() {
  server.on('error', onError);
  server.on('listening', onListening);
  server.listen(port, hostname as any, noop);
}

function normalizePort(val: string) {
  const normalizedPort = parseInt(val, 10);

  if (Number.isNaN(normalizedPort)) {
    return val;
  }
  if (normalizedPort >= 0) {
    return normalizedPort;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      log.error(`${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(`${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  log.info(`Listening at: ${hostname || 'localhost'}:${port}`);
}
