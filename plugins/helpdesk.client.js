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

export default ({ app, store, $auth }, inject) => {
  const scopes = createScopeList(app.router);
  const navigation = createNavigationTree(app.router.options.routes);

  const hasScope = (scope) => {
    return store.state.auth.hasScope(scope) || store.state.auth?.user?.isAdmin;
  };

  inject('helpdesk', { ...navigation, scopes: [...scopes, ...store.getters.scopes], hasScope });
};
