export default function ({ $auth, route, error }) {
  if (!$auth.hasScope(route.name.replaceAll('-', ':')) && !$auth?.user?.isAdmin) {
    return error({ statusCode: 403 });
  }
}
