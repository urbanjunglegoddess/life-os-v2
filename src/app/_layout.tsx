// Tailwind's output. Must be imported once, at the root, before any styled node.
import '../global.css';

import { COLOR } from '@life-os/tokens';
import { Observe, ObserveRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { startSessionAutoRefresh } from '../lib/supabase';

// Per-route navigation metrics for EAS Observe. Module scope on purpose:
// integrations cannot be configured once a screen has mounted.
Observe.configure({
  integrations: { 'expo-router': true },
});

function RootLayout() {
  // Token refresh is driven off app foreground/background rather than a bare
  // timer, which a backgrounded RN app does not reliably service. Mounted once,
  // at the root, so there is exactly one subscription for the app's lifetime.
  useEffect(() => startSessionAutoRefresh(), []);

  return (
    <SafeAreaProvider>
      {/*
        Navigator chrome takes style objects rather than class names, so it reads
        the typed constants directly — the escape hatch 4.7 §11 allows for
        "where a class will not do". It is still the semantic tier; a hex here
        would be just as much a defect as one in a component.
      */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLOR['bg-base'] },
        }}
      />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

// Wrapping the root is what lets EAS Observe measure time to first render.
export default ObserveRoot.wrap(RootLayout);
