export default function ({ $vuetify }) {
  const theme = localStorage.getItem('app.theme') || 'light';
  if (theme === 'dark') {
    $vuetify.theme.dark = true;
  } else {
    $vuetify.theme.dark = false;
  }
  localStorage.setItem('app.theme', theme);
}
