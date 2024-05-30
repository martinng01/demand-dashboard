import { format, parse } from "date-fns";
import { historicalDataRepo } from "../repos/historicalDataRepo";

export async function processCsvAndStoreData(csvData: string) {
  const lines = csvData.trim().split("\n");
  const data = lines.slice(1).map(line => line.split(","));

  const months: string[] = data.map(row => {
    const parsedDate = parse(row[0], "d/M/yyyy", new Date());
    return format(parsedDate, "yyyy-MM");
  });

  const demands: number[] = data.map(row => Number(row[1]));

  await historicalDataRepo.insert({
    data: { month: months, demand: demands },
  });
}

// export async function fetchAndConvertDataToCsv() {
//   const data = await historicalDataRepo.find({
//     limit: 1,
//     orderBy: { createdAt: "desc" },
//   });

//   if (data.length === 0) {
//     return '';
//   }

//   const { month: week, demand } = data[0].data;
//   const lines = ['Week,Demand'];

//   for (let i = 0; i < week.length; i++) {
//     lines.push(`${week[i]},${demand[i]}`);
//   }

//   return lines.join('\n');
// }