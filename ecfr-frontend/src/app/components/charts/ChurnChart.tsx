'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ANALYTICS_API = 'https://ecfr-backend-8ri8.onrender.com';

interface ChurnData {
  labels: string[];
  values: number[];
}

const ChurnChart: React.FC = () => {
  const [churnData, setChurnData] = useState<ChurnData>({ labels: [], values: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${ANALYTICS_API}/regulation_churn`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Regulation churn data:', data);
        const aggregatedData: Record<string, number> = {};

        data.forEach(({ changes_per_year }: any) => {
          Object.entries(changes_per_year).forEach(([year, count]) => {
            if (parseInt(year) > 2016) {
              aggregatedData[year] = (aggregatedData[year] || 0) + (count as number);
            }
          });
        });

        const sortedYears = Object.keys(aggregatedData).sort();
        const values = sortedYears.map((year) => aggregatedData[year]);

        setChurnData({ labels: sortedYears, values });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching regulation churn data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-3/4 mx-auto py-6 text-center text-white">
        <p>Loading regulation churn data...</p>
      </div>
    );
  }

  return (
    <div className="w-3/4 mx-auto text-center">  
      <h2 className="text-xl font-bold text-white">Regulation Churn</h2>
      <p className="mb-4 text-white">Total number of amendments to all titles by year</p>
      <Bar
        data={{
          labels: churnData.labels,
          datasets: [
            {
              label: 'Total Changes',
              data: churnData.values,
              backgroundColor: 'rgba(0, 191, 255, 0.8)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: '#fff' },
            },
            y: {
              ticks: { color: '#fff' },
            },
          },
        }}
      />
    </div>
  );
};

export default ChurnChart;
