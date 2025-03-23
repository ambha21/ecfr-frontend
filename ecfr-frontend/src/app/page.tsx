'use client';

import { useEffect, useState } from 'react';
import TitleTable from './components/TitleTable';
import { fetchTitles } from '../../utils/api';

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTitles().then((titles) => {
      setData(titles);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col h-full w-full font-inconsolata">
      <div className="flex flex-col flex-grow px-6 items-center">
        <div className="border-t border-gray-700 w-full"></div>
        <h1 className="text-3xl font-bold m-4">eCFR Explorer</h1>
        <div className="w-full"></div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <TitleTable data={data} />
          </div>
        )}
      </div>
      <div className="h-12 bg-gray-800 w-full flex items-center justify-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Department of Government Efficiency (DOGE)
        </p>
      </div>
    </div>
  );
}
