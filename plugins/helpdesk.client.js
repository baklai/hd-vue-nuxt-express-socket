const createNavigationTree = (routes, path) => {
  return routes.reduce(
    (arr, obj) => ({
      ...arr,
      [obj.name === 'index' ? 'home' : obj.name]: {
        name: obj.name === 'index' ? 'home' : obj.name,
        scope: obj.name === 'index' ? 'home' : obj.name.replaceAll('-', ':'),
        path: path ? `${path}/${obj.path}` : obj.path,
        appicon: obj?.meta?.appicon ? obj.meta.appicon : null,
        appsubtitle: obj?.meta?.appsubtitle ? obj.meta.appsubtitle : null,
        apptitle: obj?.meta?.apptitle ? obj.meta.apptitle : null,
        children: obj.children
          ? createNavigationTree(obj.children, path ? `${path}/${obj.path}` : obj.path)
          : null
      }
    }),
    {}
  );
};

const createScopeList = (router) => {
  return router.getRoutes().map((item) => ({
    scope: item.name === 'index' ? 'home' : item.name.replaceAll('-', ':'),
    comment: item.meta ? item.meta.apptitle : '-'
  }));
};

const createClientSocket = (app, store) => {
  const socket = app.$nuxtSocket({
    name: 'api',
    path: '/api',
    // auth: {
    //   token: null
    // },
    transports: ['websocket'],
    reconnection: false
  });

  socket.on('disconnect', () => {
    store.commit('isMaintenance', true);
  });

  socket.on('updateUsers', (data) => {
    if (typeof data === 'string') {
      console.error(data);
    } else {
      store.commit('helper/updateUsers', data);
    }
  });

  // socket.on('newMessage', (data) => {
  //   if (typeof data === 'string') {
  //     console.error(data);
  //   } else {
  //     app.$toast.success(data.text);
  //   }
  // });

  socket.on('api:message', (payload) => {
    if (typeof payload === 'string') app.$toast.info(payload);
  });

  socket.on('api:error', (payload) => {
    if (typeof payload === 'string') app.$toast.error(payload);
  });

  return socket;
};

export default ({ app, store, redirect }, inject) => {
  const scopes = createScopeList(app.router);

  const navigation = createNavigationTree(app.router.options.routes);

  const socket = createClientSocket(app, store);

  const helpdesk = {
    user: null,
    token: null,

    ...navigation,

    socket,

    scopes: [...scopes, ...store.getters.scopes],

    hasScope(scope) {
      return this.user.scope.includes(scope);
    },

    get loggedIn() {
      return this.user !== null;
    },

    get isAdmin() {
      return this.user?.isAdmin;
    },

    get isActive() {
      return this.user?.isActive;
    },

    emit(event, data) {
      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject('No socket connection');
        } else {
          this.socket.emit(event, data, (payload) => {
            if (payload.error) {
              reject(payload.error);
            } else {
              resolve(payload);
            }
          });
        }
      });
    },

    async login(payload) {
      this.user = await this.emit('auth:signin', { ...payload });
      return redirect('/#welcome-to-helpdesk');
    },

    async logout() {
      this.user = null;
      await this.emit('auth:signout', {});
      return redirect(`/#see-you-helpdesk`);
    }
  };

  inject('helpdesk', helpdesk);
};
