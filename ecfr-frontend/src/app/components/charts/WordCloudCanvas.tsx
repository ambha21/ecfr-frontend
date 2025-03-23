'use client';
import React, { useState, useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

const ANALYTICS_API = 'http://127.0.0.1:8000';

const WordCloudCanvas: React.FC = () => {
  const [title, setTitle] = useState(1);
  const [words, setWords] = useState<[string, number][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    if (!words || words.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear any previous rendering
    hasRendered.current = true;
    
    // Get the actual width and height of the container
    const containerWidth = containerRef.current?.clientWidth || 600;
    const containerHeight = containerRef.current?.clientHeight || 300;
    
    // Set canvas dimensions correctly
    const scaleFactor = window.devicePixelRatio || 2;
    canvas.width = containerWidth * scaleFactor;
    canvas.height = containerHeight * scaleFactor;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    
    // Clear previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scaleFactor, scaleFactor);
    
    const minSize = Math.min(...words.map(([_, value]) => value));
    const maxSize = Math.max(...words.map(([_, value]) => value));
    const normalizedWords = words.map(([text, value]) => [
      text,
      10 + ((value - minSize) / (maxSize - minSize || 1)) * 40,
    ]);
    
    WordCloud(canvas, {
      list: normalizedWords,
      gridSize: Math.round(8 * (containerWidth / 600)),
      weightFactor: (size) => Math.min(size * (containerWidth / 800), containerHeight / 10),
      rotateRatio: 0.2,
      rotationSteps: 2,
      backgroundColor: "#1E293B",
      color: () => `hsl(${Math.random() * 360}, 100%, 70%)`,
      fontFamily: 'Inter, sans-serif',
      shape: 'circle',
      drawOutOfBound: false,
      shrinkToFit: true,
      origin: [containerWidth/2, containerHeight/2]
    });
  }, [words]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md w-3/4 mx-auto text-center mb-12">
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
      <div 
        ref={containerRef} 
        className="w-full h-64 relative overflow-hidden"
      >
        {words === null ? (
          <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        )}
      </div>
    </div>
  );
};

export default WordCloudCanvas;