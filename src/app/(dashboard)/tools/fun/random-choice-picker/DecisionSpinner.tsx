/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiEdit2, FiTrash2, FiPlus, FiShare2 } from 'react-icons/fi';

type SpinnerOption = {
  id: string;
  text: string;
  color: string;
  weight: number;
};

const DecisionSpinner: React.FC = () => {
  const [options, setOptions] = useState<SpinnerOption[]>([
    { id: '1', text: 'Pizza', color: '#FF6B6B', weight: 1 },
    { id: '2', text: 'Burgers', color: '#4ECDC4', weight: 1 },
    { id: '3', text: 'Sushi', color: '#FFD166', weight: 1 },
    { id: '4', text: 'Salad', color: '#06D6A0', weight: 1 },
    { id: '5', text: 'Pasta', color: '#118AB2', weight: 1 },
    { id: '6', text: 'Tacos', color: '#EF476F', weight: 1 },
  ]);
  
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinnerTitle, setSpinnerTitle] = useState('What to eat?');
  const [titleEditing, setTitleEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinnerContainerRef = useRef<HTMLDivElement>(null);
  
  // Colors for new options
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', 
    '#118AB2', '#EF476F', '#6A0572', '#AB83A1'
  ];
  
  useEffect(() => {
    drawSpinner();
  }, [options, rotation]);
  
  // Calculate the total weight
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  
  const drawSpinner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel
    let startAngle = (rotation * Math.PI) / 180;
    let currentWeight = 0;
    
    options.forEach(option => {
      const sliceAngle = (2 * Math.PI * option.weight) / totalWeight;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill slice
      ctx.fillStyle = option.color;
      ctx.fill();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);
      
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      
      // Calculate text position based on radius
      const textRadius = radius * 0.75;
      ctx.fillText(option.text, textRadius, 5);
      
      ctx.restore();
      
      startAngle = endAngle;
      currentWeight += option.weight;
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY);
    ctx.lineTo(centerX + 40, centerY - 10);
    ctx.lineTo(centerX + 40, centerY + 10);
    ctx.closePath();
    ctx.fillStyle = '#E11D48';
    ctx.fill();
  };
  
  const spinWheel = () => {
    if (spinning || options.length < 2) return;
    
    setResult(null);
    setSpinning(true);
    
    // Calculate a random spin (between 3 and 6 full rotations)
    const spinAngle = 3 * 360 + Math.floor(Math.random() * (3 * 360));
    const newRotation = rotation + spinAngle;
    
    // Animate the spin
    let currentRotation = rotation;
    const animateStep = () => {
      const step = Math.min(10, (newRotation - currentRotation) * 0.05);
      
      if (step <= 0.1) {
        setSpinning(false);
        
        // Calculate which option the spinner landed on
        const finalAngle = (newRotation % 360) * (Math.PI / 180);
        let cumulativeAngle = 0;
        let selectedOption: SpinnerOption | null = null;
        
        for (const option of options) {
          const sliceAngle = (2 * Math.PI * option.weight) / totalWeight;
          cumulativeAngle += sliceAngle;
          
          if (finalAngle <= cumulativeAngle) {
            selectedOption = option;
            break;
          }
        }
        
        if (selectedOption) setResult(selectedOption.text);
        return;
      }
      
      currentRotation += step;
      setRotation(currentRotation);
      requestAnimationFrame(animateStep);
    };
    
    requestAnimationFrame(animateStep);
  };
  
  const addOption = () => {
    if (!newOption.trim()) return;
    
    const newId = (Math.max(...options.map(o => parseInt(o.id)), 0) + 1).toString();
    const colorIndex = options.length % colorPalette.length;
    
    setOptions([
      ...options, 
      { 
        id: newId, 
        text: newOption.trim(), 
        color: colorPalette[colorIndex],
        weight: 1
      }
    ]);
    
    setNewOption('');
  };
  
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      alert('You need at least two options!');
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };
  
  const startEdit = (option: SpinnerOption) => {
    setEditingId(option.id);
    setEditText(option.text);
  };
  
  const saveEdit = () => {
    if (!editText.trim() || !editingId) {
      setEditingId(null);
      return;
    }
    
    setOptions(options.map(option => 
      option.id === editingId ? { ...option, text: editText.trim() } : option
    ));
    
    setEditingId(null);
  };
  
  const changeWeight = (id: string, newWeight: number) => {
    if (newWeight < 1) newWeight = 1;
    if (newWeight > 10) newWeight = 10;
    
    setOptions(options.map(option => 
      option.id === id ? { ...option, weight: newWeight } : option
    ));
  };
  
  const handleTitleEdit = () => {
    setTempTitle(spinnerTitle);
    setTitleEditing(true);
  };
  
  const saveTitleEdit = () => {
    if (tempTitle.trim()) {
      setSpinnerTitle(tempTitle);
    }
    setTitleEditing(false);
  };
  
  const shareSpinner = () => {
    const data = {
      title: spinnerTitle,
      options: options
    };
    
    navigator.clipboard.writeText(JSON.stringify(data))
      .then(() => {
        alert('Spinner configuration copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const importConfig = (configText: string) => {
    try {
      const config = JSON.parse(configText);
      if (config.title && Array.isArray(config.options) && config.options.length >= 2) {
        setSpinnerTitle(config.title);
        setOptions(config.options);
        closeModal();
      } else {
        alert('Invalid configuration format');
      }
    } catch (e) {
      alert('Invalid JSON format');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          {titleEditing ? (
            <div className="flex flex-1">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-l-md flex-1"
                autoFocus
              />
              <button 
                onClick={saveTitleEdit}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-2xl font-bold flex-1">{spinnerTitle}</h1>
          )}
          
          <button 
            onClick={handleTitleEdit}
            className="ml-2 p-2 text-gray-300 hover:text-white"
          >
            <FiEdit2 />
          </button>
          
          <button 
            onClick={shareSpinner}
            className="ml-2 p-2 text-gray-300 hover:text-white"
            title="Share spinner configuration"
          >
            <FiShare2 />
          </button>
        </div>
        
        {/* Spinner */}
        <div className="flex flex-col md:flex-row gap-8">
          <div 
            ref={spinnerContainerRef} 
            className="relative w-64 h-64 mx-auto"
          >
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={300} 
              className="w-full h-full"
            />
            
            <button
              onClick={spinWheel}
              disabled={spinning || options.length < 2}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-full ${
                spinning || options.length < 2 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <FiPlay className="text-xl" />
            </button>
          </div>
          
          <div className="flex-1">
            {result && (
              <div className="mb-6 bg-indigo-900 p-4 rounded-lg text-center">
                <p className="text-sm uppercase tracking-wider">Result</p>
                <h2 className="text-2xl font-bold">{result}</h2>
              </div>
            )}
            
            {/* Add new option */}
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option..."
                  className="bg-gray-700 text-white px-3 py-2 rounded-l-md flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addOption()}
                />
                <button 
                  onClick={addOption}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-md"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            {/* Options list */}
            <div className="bg-gray-700 rounded-md overflow-hidden">
              <div className="px-4 py-2 bg-gray-600 text-sm font-medium flex">
                <span className="flex-1">Option</span>
                <span className="w-24 text-center">Weight</span>
                <span className="w-20 text-center">Actions</span>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {options.map(option => (
                  <div 
                    key={option.id} 
                    className="px-4 py-2 border-t border-gray-600 flex items-center"
                  >
                    {editingId === option.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-gray-600 text-white px-2 py-1 rounded flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        onBlur={saveEdit}
                      />
                    ) : (
                      <div className="flex-1 flex items-center">
                        <span 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: option.color }}
                        ></span>
                        {option.text}
                      </div>
                    )}
                    
                    <div className="w-24 flex items-center justify-center">
                      <button 
                        onClick={() => changeWeight(option.id, option.weight - 1)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-l"
                      >
                        -
                      </button>
                      <span className="px-2">{option.weight}</span>
                      <button 
                        onClick={() => changeWeight(option.id, option.weight + 1)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-r"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="w-20 flex justify-end">
                      <button 
                        onClick={() => startEdit(option)}
                        className="p-1 text-gray-300 hover:text-white"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => removeOption(option.id)}
                        className="p-1 ml-1 text-gray-300 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Import/Export buttons */}
            <div className="mt-4 flex justify-end">
              <button 
                onClick={openModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md mr-2"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Import Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import Spinner Configuration</h2>
            <textarea
              className="w-full bg-gray-700 text-white p-3 rounded-md h-40"
              placeholder='Paste configuration JSON here...'
            ></textarea>
            <div className="flex justify-end mt-4">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md mr-2"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea) importConfig(textarea.value);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionSpinner;