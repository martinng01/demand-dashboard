'use client';

import { useState, useEffect } from 'react';
import { ProjectedDemand } from '../shared/models';
import { projectedDemandRepo } from '../repos/projectedDemandRepo';
import '../app/globals.css';

export default function InventoryManagement() {
  const [currentStock, setCurrentStock] = useState(1000); // example initial stock
  const [projectedDemand, setProjectedDemand] = useState<ProjectedDemand[]>([]); // example monthly demand
  const [orderCost, setOrderCost] = useState(50); // example order cost
  const [holdingCost, setHoldingCost] = useState(2); // example holding cost per unit per month

  var nextMonthDemand = 0;

  useEffect(() => {
    return projectedDemandRepo
      .liveQuery({
        limit: 1,
        orderBy: { createdAt: 'desc' },
      })
      .subscribe((info) => setProjectedDemand(info.applyChanges));
  }, []);

  // Calculate EOQ using monthly figures
  const calculateEOQ = () => {
    return Math.sqrt(
      (2 * projectedDemand[0].projection * orderCost) / holdingCost
    );
  };

  var eoq = 0;
  if (projectedDemand.length) {
    eoq = calculateEOQ();
    nextMonthDemand = projectedDemand[0].projection;
  }

  return (
    <div className="inventory-management">
      <h2 className="header">Inventory Management</h2>
      <div className="input-group">
        <div className="input-item">
          <label>Current Stock: </label>
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(parseInt(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label>Next Month Demand: </label>
          <input type="number" value={nextMonthDemand.toFixed(2)} readOnly />
        </div>
        <div className="input-item">
          <label>Order Cost: </label>
          <input
            type="number"
            value={orderCost}
            onChange={(e) => setOrderCost(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label>Holding Cost per Unit per Month: </label>
          <input
            type="number"
            value={holdingCost}
            onChange={(e) => setHoldingCost(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label>Amount to Order at Next Purchase: </label>
          <input type="number" value={Math.ceil(eoq)} readOnly />
        </div>
      </div>
    </div>
  );
}
