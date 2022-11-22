export default function ({ $helpdesk, redirect }) {
  if (!$helpdesk.isAdmin) {
    return redirect('/');
  }
}
