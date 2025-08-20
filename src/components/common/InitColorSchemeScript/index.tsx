import Script from "next/script";

const InitColorSchemeScript = () => {
  const scriptContent = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-mode');
        if (!mode) {
          mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        if (mode === 'dark') {
          document.documentElement.classList.add('dark-mode');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark-mode');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {}
    })()
  `;

  return (
    <Script
      id="init-color-scheme"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
};

export default InitColorSchemeScript;