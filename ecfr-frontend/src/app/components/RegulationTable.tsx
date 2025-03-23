'use client';

import React, { useState } from 'react';
import { fetchSection } from '../../../utils/api';
import { parseXMLToHTML } from '../../../utils/utils';
import Modal from './Modal';

interface RegulationItem {
  type: string;
  identifier: string;
  label: string;
  children?: RegulationItem[];
}

interface RegulationTableProps {
  data: RegulationItem[];
  issueDate: string;
  breadcrumb?: string;
}

const RegulationTable: React.FC<RegulationTableProps> = ({ data, issueDate, breadcrumb = '' }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionContent, setSectionContent] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpand = async (item: RegulationItem, itemType: string, identifier: string) => {
    const itemBreadcrumb = breadcrumb
      ? `${breadcrumb} > ${item.type}: ${item.identifier}`
      : `${item.type}: ${item.identifier}`;

    if (itemType.toLowerCase() === 'section') {
      setIsLoading(true);
      setModalOpen(true);
      try {
        const xmlText = await fetchSection(itemBreadcrumb, issueDate);
        const parsedHTML = parseXMLToHTML(xmlText);
        setSectionContent(parsedHTML);
      } catch (error) {
        console.error('Error fetching section:', error);
        setSectionContent(<p className="text-red-500">Failed to load section.</p>);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setExpanded((prev) => ({
      ...prev,
      [identifier]: !prev[identifier],
    }));
  };

  return (
    <div className="overflow-y-auto max-h-[70vh] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
      <table className="min-w-full text-left border border-gray-700">
        <tbody>
          {data.map((item) => {
            const itemBreadcrumb = breadcrumb
              ? `${breadcrumb} > ${item.type}: ${item.identifier}`
              : `${item.type}: ${item.identifier}`;
            return (
              <React.Fragment key={item.identifier}>
                <tr
                  className="even:bg-gray-700 hover:bg-gray-600 cursor-pointer transition"
                  onClick={() => toggleExpand(item, item.type, item.identifier)}
                >
                  <td className="p-3 font-medium text-white">{item.label}</td>
                </tr>
                {expanded[item.identifier] && item.children && (
                  <tr>
                    <td colSpan={4}>
                      <div className="ml-6 border-l-2 border-gray-500 pl-4">
                        <RegulationTable
                          data={item.children}
                          breadcrumb={itemBreadcrumb}
                          issueDate={issueDate}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sectionContent={isLoading ? <p>Loading...</p> : sectionContent}
      />
    </div>
  );
};

export default RegulationTable;
