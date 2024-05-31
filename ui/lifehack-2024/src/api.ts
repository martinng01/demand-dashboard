import { remultNextApp } from 'remult/remult-next';
import { HistoricalData, ProjectedData, ProjectedDemand } from './shared/models';

export const api = remultNextApp({
  entities: [HistoricalData, ProjectedData, ProjectedDemand],
  admin: true,
});

export const { POST, PUT, DELETE, GET } = api
