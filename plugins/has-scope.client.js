export default ({ $helpdesk }, inject) => {
  const hasScope = (scope) => {
    return $helpdesk.loggedIn && ($helpdesk.hasScope(scope) || $helpdesk.isAdmin);
  };
  inject('hasScope', hasScope);
};
