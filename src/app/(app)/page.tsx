'use client';
import { Home } from './_components';
import { memo } from 'react';
/**
 * Next js uses pages to display a page in the layout, here Homepage is displayed as the user visits the website as of now.
 */
const App: React.FC = memo(() => <Home />);

App.displayName = 'App';

export default App;
