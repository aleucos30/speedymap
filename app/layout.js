import './globals.css';

export const metadata = {
  title: 'SpeedyMap',
  description: 'App di logistica e ottimizzazione ZTL',
  manifest: '/manifest.json',
  themeColor: '#121212',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
