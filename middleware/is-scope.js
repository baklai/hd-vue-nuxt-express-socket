export default function ({ $helpdesk, route, error }) {
  if (!$helpdesk.hasScope(route.name.replaceAll('-', ':')) && !$helpdesk?.user?.isAdmin) {
    return error({ statusCode: 403 });
  }
}
