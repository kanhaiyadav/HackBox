'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Settings, BarChart, PlayCircle, PauseCircle, RotateCcw, CheckCircle, Coffee, BookOpen } from 'lucide-react';

// Define types
type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
type Theme = 'default' | 'dark' | 'forest' | 'ocean';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  theme: Theme;
  volume: number;
}

interface SessionStats {
  completedPomodoros: number;
  completedShortBreaks: number;
  completedLongBreaks: number;
  totalFocusTime: number; // in seconds
}

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  autoStartBreaks: true,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  theme: 'default',
  volume: 80
};

export const PomodoroTimer: React.FC = () => {
  // State variables
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SETTINGS.pomodoro);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<SessionStats>({
    completedPomodoros: 0,
    completedShortBreaks: 0,
    completedLongBreaks: 0,
    totalFocusTime: 0
  });
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState<number>(
    settings.longBreakInterval
  );
  const [currentTask, setCurrentTask] = useState<string>("");
  const [taskList, setTaskList] = useState<{id: string, text: string, completed: boolean}[]>([]);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set up the audio element for the timer completion sound
  useEffect(() => {
    audioRef.current = new Audio('/sounds/bell.mp3');
    audioRef.current.volume = settings.volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [settings.volume]);

  // Initialize time left based on current mode
  useEffect(() => {
    switch (currentMode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak);
        break;
    }
    setStatus('idle');
  }, [currentMode, settings]);

  // Timer logic
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  // Handle timer completion
  const timerComplete = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    setStatus('completed');
    
    // Update stats
    if (currentMode === 'pomodoro') {
      setStats(prev => ({
        ...prev,
        completedPomodoros: prev.completedPomodoros + 1,
        totalFocusTime: prev.totalFocusTime + settings.pomodoro
      }));
      
      // Calculate next break type
      const newPomodorosUntilLongBreak = pomodorosUntilLongBreak - 1;
      setPomodorosUntilLongBreak(newPomodorosUntilLongBreak);
      
      if (newPomodorosUntilLongBreak <= 0) {
        // Time for a long break
        setPomodorosUntilLongBreak(settings.longBreakInterval);
        if (settings.autoStartBreaks) {
          setCurrentMode('longBreak');
          setStatus('running');
        } else {
          setCurrentMode('longBreak');
        }
      } else {
        // Time for a short break
        if (settings.autoStartBreaks) {
          setCurrentMode('shortBreak');
          setStatus('running');
        } else {
          setCurrentMode('shortBreak');
        }
      }
    } else {
      // Break is complete
      if (currentMode === 'shortBreak') {
        setStats(prev => ({
          ...prev,
          completedShortBreaks: prev.completedShortBreaks + 1
        }));
      } else {
        setStats(prev => ({
          ...prev,
          completedLongBreaks: prev.completedLongBreaks + 1
        }));
      }
      
      if (settings.autoStartPomodoros) {
        setCurrentMode('pomodoro');
        setStatus('running');
      } else {
        setCurrentMode('pomodoro');
      }
    }
    
    // Request notification permission and send notification
    if (Notification.permission === 'granted') {
      const title = currentMode === 'pomodoro' 
        ? 'Pomodoro complete! Time for a break!' 
        : 'Break complete! Time to focus!';
      new Notification(title);
    }
  };

  // Start timer
  const startTimer = () => {
    setStatus('running');
  };

  // Pause timer
  const pauseTimer = () => {
    setStatus('paused');
  };

  // Reset timer
  const resetTimer = () => {
    if (status === 'running') {
      clearInterval(timerRef.current!);
    }
    
    switch (currentMode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak);
        break;
    }
    
    setStatus('idle');
  };

  // Switch timer mode
  const switchMode = (mode: TimerMode) => {
    if (status === 'running') {
      clearInterval(timerRef.current!);
    }
    setCurrentMode(mode);
  };

  // Format time left as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save settings
  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    setIsSettingsOpen(false);
  };

  // Task handling functions
  const addTask = () => {
    if (currentTask.trim()) {
      setTaskList([...taskList, {
        id: Date.now().toString(),
        text: currentTask,
        completed: false
      }]);
      setCurrentTask("");
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTaskList(
      taskList.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTaskList(taskList.filter(task => task.id !== taskId));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setTimeLeft(parsedSettings.pomodoro);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    
    // Load saved stats
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Failed to parse saved stats:', error);
      }
    }
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
  }, [stats]);

  // Calculate progress percentage for the circular timer
  const calculateProgress = () => {
    let totalTime;
    switch (currentMode) {
      case 'pomodoro':
        totalTime = settings.pomodoro;
        break;
      case 'shortBreak':
        totalTime = settings.shortBreak;
        break;
      case 'longBreak':
        totalTime = settings.longBreak;
        break;
    }
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Get background color based on current mode and theme
  const getBackgroundColor = () => {
    const themeColors = {
      default: {
        pomodoro: 'bg-red-500',
        shortBreak: 'bg-green-500',
        longBreak: 'bg-blue-500'
      },
      dark: {
        pomodoro: 'bg-red-900',
        shortBreak: 'bg-green-900',
        longBreak: 'bg-blue-900'
      },
      forest: {
        pomodoro: 'bg-orange-600',
        shortBreak: 'bg-emerald-600',
        longBreak: 'bg-teal-700'
      },
      ocean: {
        pomodoro: 'bg-pink-600',
        shortBreak: 'bg-cyan-600',
        longBreak: 'bg-indigo-700'
      }
    };
    
    return themeColors[settings.theme][currentMode];
  };

  // Get text color based on current mode and theme
  const getTextColor = () => {
    const themeTextColors = {
      default: 'text-white',
      dark: 'text-gray-200',
      forest: 'text-gray-100',
      ocean: 'text-gray-100'
    };
    
    return themeTextColors[settings.theme];
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${getTextColor()}`}>Focus Time</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsStatsOpen(true)}
              className="p-2 rounded-full bg-background bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <BarChart className={getTextColor()} size={24} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full bg-background bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <Settings className={getTextColor()} size={24} />
            </button>
          </div>
        </header>

        <main className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="bg-background bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-6">
              <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={() => switchMode('pomodoro')} 
                  className={`px-4 py-2 rounded-full ${
                    currentMode === 'pomodoro' 
                      ? 'bg-background bg-opacity-30 font-bold' 
                      : 'bg-transparent hover:bg-background hover:bg-opacity-10'
                  } transition-colors ${getTextColor()}`}
                >
                  Focus
                </button>
                <button 
                  onClick={() => switchMode('shortBreak')} 
                  className={`px-4 py-2 rounded-full ${
                    currentMode === 'shortBreak' 
                      ? 'bg-background bg-opacity-30 font-bold' 
                      : 'bg-transparent hover:bg-background hover:bg-opacity-10'
                  } transition-colors ${getTextColor()}`}
                >
                  Short Break
                </button>
                <button 
                  onClick={() => switchMode('longBreak')} 
                  className={`px-4 py-2 rounded-full ${
                    currentMode === 'longBreak' 
                      ? 'bg-background bg-opacity-30 font-bold' 
                      : 'bg-transparent hover:bg-background hover:bg-opacity-10'
                  } transition-colors ${getTextColor()}`}
                >
                  Long Break
                </button>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="transparent" 
                      stroke="rgba(255, 255, 255, 0.1)" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="transparent" 
                      stroke="rgba(255, 255, 255, 0.9)" 
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={(283 * (100 - calculateProgress())) / 100} 
                      transform="rotate(-90 50 50)" 
                      className="transition-all duration-1000" 
                    />
                    <text 
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className={`text-4xl font-bold ${getTextColor()}`}
                      fill="currentColor"
                    >
                      {formatTime(timeLeft)}
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-center gap-6">
                {status === 'running' ? (
                  <button 
                    onClick={pauseTimer} 
                    className="p-3 rounded-full bg-background bg-opacity-20 hover:bg-opacity-30 transition-colors"
                  >
                    <PauseCircle className={getTextColor()} size={36} />
                  </button>
                ) : (
                  <button 
                    onClick={startTimer} 
                    className="p-3 rounded-full bg-background bg-opacity-20 hover:bg-opacity-30 transition-colors"
                  >
                    <PlayCircle className={getTextColor()} size={36} />
                  </button>
                )}
                <button 
                  onClick={resetTimer} 
                  className="p-3 rounded-full bg-background bg-opacity-20 hover:bg-opacity-30 transition-colors"
                >
                  <RotateCcw className={getTextColor()} size={36} />
                </button>
              </div>
            </div>
            
            <div className="bg-background bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <h2 className={`text-xl font-bold mb-4 ${getTextColor()}`}>
                Session Stats
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-background bg-opacity-10 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${getTextColor()}`}>
                    {stats.completedPomodoros}
                  </div>
                  <div className={`${getTextColor()} opacity-80`}>
                    Pomodoros
                  </div>
                </div>
                <div className="bg-background bg-opacity-10 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${getTextColor()}`}>
                    {Math.floor(stats.totalFocusTime / 60)}
                  </div>
                  <div className={`${getTextColor()} opacity-80`}>
                    Minutes
                  </div>
                </div>
                <div className="bg-background bg-opacity-10 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold ${getTextColor()}`}>
                    {pomodorosUntilLongBreak}
                  </div>
                  <div className={`${getTextColor()} opacity-80`}>
                    Until Break
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="bg-background bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <h2 className={`text-xl font-bold mb-4 ${getTextColor()}`}>
                <div className="flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  Tasks
                </div>
              </h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What are you working on?"
                    className="flex-1 px-4 py-2 rounded-lg bg-background bg-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 rounded-lg bg-background bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {taskList.length === 0 ? (
                  <div className={`text-center py-4 ${getTextColor()} opacity-70`}>
                    No tasks yet. Add some to get started!
                  </div>
                ) : (
                  taskList.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background bg-opacity-10 hover:bg-opacity-20 transition-colors"
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mr-3 rounded-full p-1 ${
                            task.completed ? 'bg-green-500' : 'bg-background bg-opacity-20'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </button>
                        <span className={`${getTextColor()} ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}>
                          {task.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-white opacity-60 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          onSave={saveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
      
      {/* Stats Modal */}
      {isStatsOpen && (
        <StatsModal 
          stats={stats}
          onClose={() => setIsStatsOpen(false)}
          onReset={() => {
            setStats({
              completedPomodoros: 0,
              completedShortBreaks: 0,
              completedLongBreaks: 0,
              totalFocusTime: 0
            });
            setIsStatsOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Settings Modal Component
interface SettingsModalProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [tempSettings, setTempSettings] = useState<TimerSettings>({...settings});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setTempSettings({
        ...tempSettings,
        [name]: checked
      });
    } else if (type === 'number') {
      setTempSettings({
        ...tempSettings,
        [name]: name.includes('Break') || name === 'pomodoro' 
          ? parseInt(value) * 60 // Convert minutes to seconds
          : parseInt(value)
      });
    } else if (name === 'volume') {
      setTempSettings({
        ...tempSettings,
        volume: parseInt(value)
      });
    } else {
      setTempSettings({
        ...tempSettings,
        [name]: value
      });
    }
  };
  
  // Convert seconds to minutes for display
  const secsToMins = (secs: number) => Math.floor(secs / 60);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-background rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Timer Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Time (minutes)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pomodoro</label>
              <input
                type="number"
                name="pomodoro"
                value={secsToMins(tempSettings.pomodoro)}
                onChange={handleInputChange}
                min="1"
                max="60"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Short Break</label>
              <input
                type="number"
                name="shortBreak"
                value={secsToMins(tempSettings.shortBreak)}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Long Break</label>
              <input
                type="number"
                name="longBreak"
                value={secsToMins(tempSettings.longBreak)}
                onChange={handleInputChange}
                min="1"
                max="60"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Auto Start</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartBreaks"
                name="autoStartBreaks"
                checked={tempSettings.autoStartBreaks}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="autoStartBreaks">Auto-start breaks</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartPomodoros"
                name="autoStartPomodoros"
                checked={tempSettings.autoStartPomodoros}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="autoStartPomodoros">Auto-start pomodoros</label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Long Break Interval</h3>
          <input
            type="number"
            name="longBreakInterval"
            value={tempSettings.longBreakInterval}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Theme</h3>
          <select
            name="theme"
            value={tempSettings.theme}
            onChange={(e) => setTempSettings({...tempSettings, theme: e.target.value as Theme})}
            className="w-full p-2 border rounded-lg"
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
          </select>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sound Volume</h3>
          <input
            type="range"
            name="volume"
            min="0"
            max="100"
            value={tempSettings.volume}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span>{tempSettings.volume}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(tempSettings)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Modal Component
interface StatsModalProps {
  stats: SessionStats;
  onClose: () => void;
  onReset: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, onReset }) => {
    // Format total focus time
    const formatTotalTime = () => {
        const hours = Math.floor(stats.totalFocusTime / 3600);
        const minutes = Math.floor((stats.totalFocusTime % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Session Statistics</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {stats.completedPomodoros}
                        </div>
                        <div className="text-gray-600">Pomodoros</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {formatTotalTime()}
                        </div>
                        <div className="text-gray-600">Focus Time</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {stats.completedShortBreaks}
                        </div>
                        <div className="text-gray-600">Short Breaks</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-indigo-600">
                            {stats.completedLongBreaks}
                        </div>
                        <div className="text-gray-600">Long Breaks</div>
                    </div>
                </div>

                <p className="text-gray-600 mb-6">
                    These statistics are for your current session. They will
                    reset when you clear your browser data.
                </p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                        Reset Stats
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;