'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get('result');
  let result: any = null;

  if (resultParam) {
    try {
      result = JSON.parse(resultParam);
    } catch (error) {
      console.error("Failed to parse search result", error);
    }
  }

  if (!result) {
    return <p className="text-center text-gray-400">No search result data available.</p>;
  }

  return (
    <div className="h-full flex flex-col items-center bg-gray-900 text-white">
      <div className="flex-grow flex flex-col p-6">
        <h1 className="text-3xl font-bold mb-6">Search Result</h1>
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg border border-gray-700">
          <p className="text-gray-400">
            📅 <span className="font-bold">Effective Dates:</span>{' '}
            {result.starts_on} → {result.ends_on || "Present"}
          </p>
          <p className="text-gray-400">
            📖 <span className="font-bold">Type:</span> {result.type}
          </p>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">📌 Hierarchy</h2>
            <ul className="text-gray-300">
              {Object.entries(result.hierarchy_headings)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key}:</span> {value}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">📝 Headings</h2>
            <ul className="text-gray-300">
              {Object.entries(result.headings)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key}:</span>{' '}
                    <span dangerouslySetInnerHTML={{ __html: value }} />
                  </li>
                ))}
            </ul>
          </div>
          {result.full_text_excerpt && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">🔍 Excerpt</h2>
              <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: result.full_text_excerpt }} />
            </div>
          )}
          <div className="mt-4 text-gray-400">
            <p>📊 <span className="font-bold">Score:</span> {result.score}</p>
            <p>📑 <span className="font-bold">Index:</span> {result.structure_index}</p>
            <p>🔖 <span className="font-bold">Status:</span> {result.reserved ? "Reserved" : "Active"}</p>
            <p>❌ <span className="font-bold">Removed:</span> {result.removed ? "Yes" : "No"}</p>
            <p>🔄 <span className="font-bold">Changes:</span> {result.change_types.join(", ")}</p>
          </div>
        </div>
      </div>
      <div className="h-12 bg-gray-800 w-full flex items-center justify-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Department of Government Efficiency (DOGE)
        </p>
      </div>
    </div>
  );
}
