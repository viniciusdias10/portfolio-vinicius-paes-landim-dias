import React, { useEffect } from 'react';

export function VLibras() {
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('vlibras-script')) return;

    const script = document.createElement('script');
    script.id = 'vlibras-script';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div {...({ vw: "true" } as any)} className="enabled">
      <div {...({ 'vw-access-button': "true" } as any)} className="active"></div>
      <div {...({ 'vw-plugin-wrapper': "true" } as any)}>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
