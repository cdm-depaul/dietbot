'use client';

import dynamic from 'next/dynamic';

// Load Home only on the client so useSearchParams() etc. don't run on the server
const HomeClient = dynamic(
  () => import('./../_components').then(m => m.Home),
  {
    ssr: false,
    loading: () => <div style={{ padding: 16 }}>Loading…</div>,
  }
);

export default function DietbotClient() {
  return <HomeClient />;
}
