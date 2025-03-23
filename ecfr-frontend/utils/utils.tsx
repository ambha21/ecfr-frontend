import React from 'react';

export const parseXMLToHTML = (xmlString: string): TSX.Element => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  let htmlContent = "";

  // Extract section header
  const head = xmlDoc.querySelector("HEAD");
  if (head && head.textContent) {
    htmlContent += `<h2 class="text-xl font-bold mb-4">${head.textContent}</h2>`;
  }

  // Extract paragraphs
  xmlDoc.querySelectorAll("P").forEach((p) => {
    htmlContent += `<p class="mb-2">${p.innerHTML}</p>`;
  });

  // Extract citations
  xmlDoc.querySelectorAll("CITA").forEach((cita) => {
    if (cita.textContent) {
      htmlContent += `<p class="text-sm text-gray-400">${cita.textContent}</p>`;
    }
  });

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
