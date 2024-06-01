// src/app/page.tsx
import DemandForecasting from '../components/demandForecasting';
import InventoryManagement from '../components/inventoryManagement';
import Map from '@/components/maps';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="flex w-full h-3/4 p-5 justify-center">
        <div className="flex flex-col col-span-full col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 mx-5">
          <Map />
        </div>
        <div className="flex flex-col col-span-full col-span-3 bg-white shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <DemandForecasting />
        </div>
      </div>
      <div className="flex w-full h-1/4 justify-center">
        <InventoryManagement />
      </div>
    </div>
  );
}
