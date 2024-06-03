import { remultNextApp } from 'remult/remult-next';
import { createPostgresDataProvider } from 'remult/postgres';
import { HistoricalData, ProjectedData, ProjectedDemand } from './shared/models';

const dataProvider = createPostgresDataProvider({
  connectionString: process.env["POSTGRES_URL"] || process.env["DATABASE_URL"],
  configuration: {
    ssl: Boolean(process.env["POSTGRES_URL"]),
  },
})

export const api = remultNextApp({
  entities: [HistoricalData, ProjectedData, ProjectedDemand],
  admin: true,
  dataProvider: dataProvider,
});

export const { POST, PUT, DELETE, GET } = api

