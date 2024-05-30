import { remultNextApp } from 'remult/remult-next';
import { HistoricalData, ProjectedData } from './shared/models';

export const api = remultNextApp({
  entities: [HistoricalData, ProjectedData],
  admin: true,
});

export const { POST, PUT, DELETE, GET } = api
