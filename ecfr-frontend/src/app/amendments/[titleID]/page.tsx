'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchAmendments } from '../../../../utils/api';
import AmendmentsCard from '../../components/AmendmentsCard';

export default function AmendmentsPage() {
  const { titleId } = useParams() as { titleId: string };
  const [amendmentData, setAmendmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (titleId) {
      fetchAmendments(titleId).then((data) => {
        setAmendmentData(data);
        setLoading(false);
      });
    }
  }, [titleId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <h1 className="text-3xl font-bold p-4">Title {titleId} Amendments</h1>
        {loading ? (
          <p>Loading...</p>
        ) : amendmentData ? (
          <AmendmentsCard data={amendmentData} />
        ) : (
          <p>Error loading amendment data</p>
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
