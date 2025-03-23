'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { fetchParsedSection } from '../../../utils/api';
import { parseXMLToHTML } from '../../../utils/utils';

interface AmendmentsCardProps {
  data: any; // refine type as needed
}

const AmendmentsCard: React.FC<AmendmentsCardProps> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionContent, setSectionContent] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const amendmentJson = data.content_versions;

  // Group amendments by date
  const groupedByDate = amendmentJson.reduce((acc: Record<string, any[]>, item: any) => {
    acc[item.amendment_date] = acc[item.amendment_date] || [];
    acc[item.amendment_date].push(item);
    return acc;
  }, {});

  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const fetchSectionContent = async (section: any) => {
    setIsLoading(true);
    setModalOpen(true);
    const breadCrumbObj = {
      title: section.title,
      part: section.part,
      subpart: section.subpart || null,
      section: section.identifier,
    };
    try {
      // @ts-ignore
      const xmlText = await fetchParsedSection(breadCrumbObj, section.issue_date);
      const parsedHTML = parseXMLToHTML(xmlText);
      setSectionContent(parsedHTML);
    } catch (error) {
      console.error('Error fetching section:', error);
      setSectionContent(<p className="text-red-500">Failed to load section.</p>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sectionContent={isLoading ? <p>Loading...</p> : sectionContent}
      />
      <div className="max-h-[70vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 p-2 border border-gray-700 rounded-lg bg-gray-800">
        {Object.keys(groupedByDate)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date) => (
            <div key={date} className="border border-gray-600 bg-gray-700 rounded-lg p-4">
              <button
                className="w-full text-left text-lg font-semibold text-white flex justify-between"
                onClick={() => toggleDate(date)}
              >
                <span>{date}</span>
                <span className="text-gray-400 text-sm">
                  {groupedByDate[date].length === 1
                    ? '1 change'
                    : `${groupedByDate[date].length} changes`}
                </span>
                <span>{expandedDates[date] ? '▲' : '▼'}</span>
              </button>
              {expandedDates[date] && (
                <div className="mt-3 space-y-3">
                  {groupedByDate[date].map((section: any, index: number) => (
                    <div
                      key={`${date}-${section.identifier}-${index}`}
                      className="p-3 border border-gray-500 rounded bg-gray-600 cursor-pointer hover:bg-gray-500 transition"
                      onClick={() => fetchSectionContent(section)}
                    >
                      <h3 className="text-white font-medium">{section.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AmendmentsCard;
