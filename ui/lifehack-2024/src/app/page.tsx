// src/app/page.tsx
import DemandForecasting from '../components/demandForecasting';
import InventoryManagement from '../components/inventoryManagement';

export default function Home() {
  return (
    <div>
      <DemandForecasting />
      <InventoryManagement />
    </div>
  )
}