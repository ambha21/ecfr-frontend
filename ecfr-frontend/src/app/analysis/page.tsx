'use client';

import WordsByTitle from '../components/charts/WordsByTitle';
import ChurnChart from '../components/charts/ChurnChart';
import WordCloudCanvas from '../components/charts/WordCloudCanvas';

export default function AnalysisPage() {
  return (
    <div>
      <div className="p-4 min-h-screen bg-gray-900 text-white space-y-10">
        <WordsByTitle />
        <ChurnChart />
        <WordCloudCanvas />
      </div>
      <div className="h-12 bg-gray-800 w-full flex items-center justify-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Department of Government Efficiency (DOGE)
        </p>
      </div>
    </div>
  );
}
