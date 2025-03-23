'use client';

import WordsByTitle from '../components/charts/WordsByTitle';
import ChurnChart from '../components/charts/ChurnChart';
import WordCloudCanvas from '../components/charts/WordCloudCanvas';

export default function AnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-4 bg-gray-900 text-white space-y-10">
        <ChurnChart />
        <WordsByTitle />
        <WordCloudCanvas />
      </div>
      <div className="h-12 bg-gray-800 w-full flex items-center justify-center mt-auto">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Department of Government Efficiency (DOGE)
        </p>
      </div>
    </div>
  );
}