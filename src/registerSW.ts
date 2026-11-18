if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    void navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(() => {});
  });
}
