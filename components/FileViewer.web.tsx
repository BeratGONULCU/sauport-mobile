import React from 'react';

type Props = { fileUrl?: string; fileType?: string };

export default function FileViewer({ fileUrl, fileType }: Props) {
  if (!fileUrl) return <>Dosya bulunamadı</>;

  const t = (fileType ?? '').toLowerCase();

  if (t === 'pdf') {
    // WebView yok; web'de doğrudan <iframe> kullan
    return (
      <iframe
        src={fileUrl}
        style={{ width: '100%', height: 600, border: 0 }}
        title="pdf"
      />
    );
  }

  if (t === 'mp4') {
    return (
      <video
        src={fileUrl}
        style={{ width: '100%', height: 360 }}
        controls
      />
    );
  }

  // pptx/docx: web'de en pratik: Office viewer ya da yeni sekmede aç
  if (t === 'pptx' || t === 'docx') {
    const officeUrl =
      `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    return (
      <iframe
        src={officeUrl}
        style={{ width: '100%', height: 600, border: 0 }}
        title="office"
      />
    );
  }

  return <a href={fileUrl} target="_blank" rel="noreferrer">Dosyayı aç</a>;
}
