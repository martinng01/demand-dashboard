// src/app/page.tsx
import HistoricalDataChart from '../components/demandForecasting';
import Map from '@/components/maps';

export default function Home() {
  return (
    <div className="flex items-center h-screen space-x-4">
      <div className="w-1/2">
        <Map />
      </div>
      <div className="w-1/2">
        <HistoricalDataChart />
      </div>
    </div>
  );
}
