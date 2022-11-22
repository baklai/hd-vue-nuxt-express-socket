const socketAPI = require('../api');

export default function () {
  this.nuxt.hook('listen', (server, { host, port }) => {
    socketAPI(server, {
      maxHttpBufferSize: 1e8,
      pingTimeout: 60000,
      allowEIO3: true,
      cors: {
        origin: '*',
        credentials: true
      },
      path: '/api'
    });

    console.info('Socket api server is running');
  });
}
