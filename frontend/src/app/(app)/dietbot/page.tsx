import { Suspense } from 'react';
import DietbotClient from './DietBotClient';

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <DietbotClient />
    </Suspense>
  );
}