'use client';

import React, { useState, useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

const ANALYTICS_API = 'https://ecfr-backend.onrender.com';

const WordCloudCanvas: React.FC = () => {
  const [title, setTitle] = useState(1);
  const [words, setWords] = useState<[string, number][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRendered = useRef(false);

  useEffect(() => {
    setWords(null);
    hasRendered.current = false;

    fetch(`${ANALYTICS_API}/common_words_by_title?title=${title}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWords(data.map(([text, value]: [string, number]) => [text, value]));
        } else {
          setWords([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching word cloud data:', error);
        setWords([]);
      });
  }, [title]);

  useEffect(() => {
    if (!words || words.length === 0 || !canvasRef.current || hasRendered.current) return;
    hasRendered.current = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement?.clientWidth || 600;
    const height = 400;
    const scaleFactor = window.devicePixelRatio || 2;

    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx?.scale(scaleFactor, scaleFactor);

    const minSize = Math.min(...words.map(([_, value]) => value));
    const maxSize = Math.max(...words.map(([_, value]) => value));

    const normalizedWords = words.map(([text, value]) => [
      text,
      10 + ((value - minSize) / (maxSize - minSize)) * 40,
    ]);

    WordCloud(canvas, {
      list: normalizedWords,
      gridSize: Math.round(8 * (width / 600)),
      weightFactor: (size) => size * (width / 800),
      rotateRatio: 0.2,
      rotationSteps: 2,
      backgroundColor: "#1E293B",
      color: () => `hsl(${Math.random() * 360}, 100%, 70%)`,
      shrinkToFit: true,
    });
  }, [words]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md w-3/4 mx-auto">
      <h2 className="text-xl font-bold mb-4">Common Words in Title {title}</h2>
      <select
        className="mb-4 p-2 bg-gray-800 text-white rounded border border-gray-600"
        value={title}
        onChange={(e) => setTitle(Number(e.target.value))}
      >
        {[...Array(50).keys()].map((i) => (
          <option key={i + 1} value={i + 1}>
            Title {i + 1}
          </option>
        ))}
      </select>
      {words === null ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-64"></canvas>
      )}
    </div>
  );
};

export default WordCloudCanvas;
