export default function ({ $helpdesk, redirect }) {
  if (!$helpdesk.loggedIn) {
    return redirect('/');
  }
}
