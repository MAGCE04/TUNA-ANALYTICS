import dynamic from 'next/dynamic';

// Use dynamic import with { ssr: false } to prevent server-side rendering of components that use Solana
const DynamicDashboard = dynamic(() => import('./dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🐟</span>
        </div>
      </div>
    </div>
  )
});

export default function Home() {
  return <DynamicDashboard />;
}