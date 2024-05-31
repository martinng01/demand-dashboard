'use client';

import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { addMonths, format } from 'date-fns';
import { useS3Upload } from 'next-s3-upload';
import axios from 'axios';
import { HistoricalData } from '../shared/models';
import { ProjectedData } from '../shared/models';
import { historicalDataRepo } from '../repos/historicalDataRepo';
import { projectedDataRepo } from '../repos/projectedDataRepo';
import { projectedDemandRepo } from '../repos/projectedDemandRepo';
import { processCsvAndStoreData } from '../utils/csvProcessor';
import '../app/globals.css';

export default function DemandForecasting() {
  const [histData, setHistData] = useState<HistoricalData[]>([]);
  const [projectedData, setProjectedData] = useState<ProjectedData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const projectedMonths = 6;
  var splitDate = new Date(2024, 1);

  useEffect(() => {
    const a = historicalDataRepo
      .liveQuery({
        limit: 1,
        orderBy: { createdAt: 'desc' },
      })
      .subscribe((info) => setHistData(info.applyChanges));
    const b = projectedDataRepo
      .liveQuery({
        limit: 1,
        orderBy: { createdAt: 'desc' },
      })
      .subscribe((info) => setProjectedData(info.applyChanges));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Simulate a delay function
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    if (file) {
      setLoading(true); // Set loading to true when starting the file processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          // await uploadFileAndWaitForProcessing(file);
          fetchProjectedData();
          await processCsvAndStoreData(text);
          setLoading(false); // Set loading to false once processing is done
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadFileAndWaitForProcessing = async (file: File) => {
    setIsRetraining(true);
    await uploadToS3(file);

    for (let i = 0; i < 360; i++) {
      console.log('Waiting for reply...');
      await delay(1000);
      const response = await axios.get(
        'https://8h09twey46.execute-api.ap-southeast-1.amazonaws.com/dev'
      );
      const responseData = response.data;
      if (
        responseData.sfnStatus === 'SUCCEEDED' &&
        responseData.endpointStatus === 'InService'
      ) {
        console.log(responseData);
        break;
      }
    }
    setIsRetraining(false);
  };

  const fetchProjectedData = async () => {
    const months: string[] = [];
    const demands: number[] = [];
    for (let i = 1; i <= projectedMonths; i++) {
      const projectedMonth = addMonths(splitDate, i);
      const projectedDate = format(projectedMonth, 'yyyy-MM') + '-01';
      console.log(projectedDate);
      try {
        const response = await axios.post(
          'https://8h09twey46.execute-api.ap-southeast-1.amazonaws.com/dev',
          {
            date: projectedDate,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const responseData = response.data;
        const projectedDemand = responseData.prediction;
        if (i === 1) {
          await projectedDemandRepo.insert({ projection: projectedDemand });
        }

        months.push(format(projectedMonth, 'yyyy-MM'));
        demands.push(projectedDemand);
      } catch (error) {
        console.error(
          'Error fetching projected demand:',
          (error as Error).message
        );
      }
    }
    await projectedDataRepo.insert({
      data: { month: months, demand: demands },
    });
  };

  var chartData: (number | string)[][] = [
    ['Month', 'Demand', 'Projected Demand'],
  ];

  // const tickValues = [];

  if (histData.length) {
    const lastDate = histData[0].data.month[histData[0].data.month.length - 1];
    const lastYear = parseInt(lastDate.slice(0, 4));
    const lastMonth = parseInt(lastDate.slice(5, 7));
    const currentDate = new Date(lastYear, lastMonth);
    splitDate = currentDate;

    const previousMonths = 24;
    const startDate = addMonths(currentDate, -previousMonths);

    histData[0].data.month.forEach((month, index) => {
      if (month < format(startDate, 'yyyy-MM')) {
        return;
      }
      chartData.push([month, histData[0].data.demand[index], 0]);
    });

    if (projectedData.length) {
      projectedData[0].data.month.forEach((month, index) => {
        chartData.push([month, 0, projectedData[0].data.demand[index]]);
      });
    }
    // const startYear = parseInt((chartData[1][0] as string).slice(0, 4));
    // const startMonth = parseInt((chartData[1][0] as string).slice(5, 7));
    // const startDate = new Date(startYear, startMonth);
    // for (let i = 0; i < histData[0].data.month.length; i += 6) {
    //   tickValues.push(format(addMonths(startDate, i), 'yyyy-MM'));
    // }
  }

  const options = {
    title: 'Demand Forecasting',
    titleTextStyle: {
      fontSize: 24,
      bold: true,
      color: '#000',
      italic: false,
    },
    isStacked: true,
    hAxis: {
      title: 'Month',
      format: 'yyyy-MM',
    },
    vAxis: { title: 'Demand' },
    legend: { position: 'bottom', alignment: 'center' }, // Adjust legend position and alignment
    bar: { groupWidth: '80%' },
    series: {
      0: { color: '#081F5E' }, // Series 0 color
      1: { color: '#78568A' }, // Series 1 color
    },
  };

  return (
    <div className="page-container">
      {/* <h2 className="header">Demand Forecasting</h2> */}
      {!histData ? (
        <div>Loading...</div>
      ) : (
        <div className="chart-wrapper">
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={chartData}
            options={options}
          />
        </div>
      )}
      <div className="input-container">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input"
        />
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={loading} // Disable the button when loading
        >
          Submit
        </button>
        {loading && (
          <div>
            <div className="spinner"></div>
            {isRetraining && (
              <div className="retraining-text">Retraining</div>
            )}{' '}
          </div>
        )}
      </div>
    </div>
  );
}
