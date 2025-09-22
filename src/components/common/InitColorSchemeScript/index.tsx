import Script from "next/script";

const InitColorSchemeScript = () => {
  // Keep the script content as a single, stable string to avoid any SSR/CSR serialization mismatch.
  const scriptContent = "!function(){try{document.documentElement.classList.remove('dark-mode');document.documentElement.style.colorScheme='light'}catch(e){}}();";

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="init-color-scheme"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
};

export default InitColorSchemeScript;
