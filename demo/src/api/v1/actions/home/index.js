// curl localhost:1337/home
export function handleHome() {
  return {
    page: 'pages/home',
    data: { lang: 'en' },
  };
}
