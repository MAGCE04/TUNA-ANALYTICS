'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

/**
 * A utility function to dynamically import components that use Solana libraries
 * This prevents SSR issues by ensuring these components only load on the client
 * 
 * @param importFunc - The import function that loads the component
 * @param LoadingComponent - Optional loading component to show while loading
 * @returns A dynamically loaded component with SSR disabled
 */
export function dynamicSolanaComponent<P>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent: ReactNode = null
) {
  return dynamic(importFunc, {
    ssr: false,
    loading: () => <>{LoadingComponent}</>
  });
}

/**
 * A wrapper component that ensures its children are only rendered on the client side
 * Use this for sections of your app that use Solana-specific code
 */
export function SolanaClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}