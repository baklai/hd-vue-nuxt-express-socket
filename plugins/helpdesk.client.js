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

// const createClientSocket = (app, store) => {

//   return socket;
// };

export default ({ app, store, redirect }, inject) => {
  const scopes = createScopeList(app.router);

  const navigation = createNavigationTree(app.router.options.routes);

  // const socket = null; // = createClientSocket(app, store);

  const helpdesk = {
    user: null,
    token: null,
    socket: null,

    ...navigation,

    // socket,

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
      this.socket = app.$nuxtSocket({
        name: 'helpdesk',
        path: '/helpdesk',
        transports: ['websocket'],
        reconnection: false
      });

      this.socket.on('connect', async () => {
        this.user = await this.emit('auth:signin', { ...payload });
        redirect('/#welcome-to-helpdesk');
      });

      this.socket.on('disconnect', () => {
        this.user = null;
        this.token = null;
        redirect('/#see-you-helpdesk');
      });

      this.socket.on('helpdesk:user:signin', (payload) => {
        store.commit('updateUsers', payload);
      });

      this.socket.on('helpdesk:user:signout', (payload) => {
        store.commit('updateUsers', payload);
      });

      this.socket.on('helpdesk:message', (payload) => {
        if (typeof payload === 'string') app.$toast.success(payload);
      });

      this.socket.on('helpdesk:error', (payload) => {
        if (typeof payload === 'string') app.$toast.error(payload);
      });
    },

    async logout() {
      this.user = null;
      await this.emit('auth:signout', {});
      return redirect(`/#see-you-helpdesk`);
    }
  };

  inject('helpdesk', helpdesk);
};
