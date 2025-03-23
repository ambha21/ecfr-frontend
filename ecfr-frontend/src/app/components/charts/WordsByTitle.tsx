'use client';

import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';

const ANALYTICS_API = 'http://127.0.0.1:8000';

interface TitleData {
  number: number;
  name: string;
  word_count?: number;
}

const WordsByTitle: React.FC = () => {
  const [wordCounts, setWordCounts] = useState<TitleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ANALYTICS_API}/words_by_title`)
      .then((response) => response.json())
      .then((data: TitleData[]) => {
        console.log('Fetched data:', data);
        const sortedData = data.sort((a, b) => (b.word_count || 0) - (a.word_count || 0));
        setWordCounts(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching word counts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-3/4 mx-auto py-6 text-center text-white">
        <p>Loading title data...</p>
      </div>
    );
  }

  return (
    <div className="w-3/4 mx-auto">
      <h2 className="text-xl font-bold mb-4">Words by Title</h2>
      <div className="mb-6 border-t border-gray-700 w-full"></div>
      <h1 className="text-center p-4 text-2xl font-bold text-sky-400">
        Total words:{' '}
        <CountUp
          end={wordCounts.reduce((sum, title) => sum + (title.word_count || 0), 0)}
          separator=","
          duration={2}
        />
      </h1>
      <div className="overflow-x-auto max-h-[500px] border rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="p-3 text-left">Title Number</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Word Count</th>
              <th className="p-3 text-left">Visualization</th>
            </tr>
          </thead>
          <tbody>
            {wordCounts.map((title, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{title.number}</td>
                <td className="p-3">{title.name}</td>
                <td className="p-3">
                  {title.word_count !== undefined ? title.word_count.toLocaleString() : 'N/A'}
                </td>
                <td className="p-3">
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{
                        width: `${
                          title.word_count && wordCounts[0].word_count
                            ? (title.word_count / wordCounts[0].word_count) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordsByTitle;
// Compare this snippet from ecfr-frontend/src/app/components/charts/ChurnChart.tsx: