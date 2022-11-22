export default ({ $auth }, inject) => {
  const hasScope = (scope) => {
    return $auth.loggedIn && ($auth.hasScope(scope) || $auth?.user?.isAdmin);
  };
  inject('hasScope', hasScope);
};
