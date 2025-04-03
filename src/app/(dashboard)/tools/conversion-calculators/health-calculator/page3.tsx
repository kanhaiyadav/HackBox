'use client';

// components/HealthCalculator.tsx
import React, { useState } from 'react';

interface UserData {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  exerciseDays: number;
  sleepHours: number;
  waterIntake: number; // current daily water in liters
  stressLevel: 'low' | 'medium' | 'high';
  goalType: 'maintain' | 'lose' | 'gain';
}

interface HealthMetrics {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  proteinNeed: number;
  waterNeed: number;
  idealWeight: number;
  bodyFatEstimate: number;
  sleepRecommendation: number;
  calorieGoal: number;
}

const HealthCalculator: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserData>({
    age: 30,
    weight: 70,
    height: 170,
    gender: 'male',
    activityLevel: 'moderate',
    exerciseDays: 3,
    sleepHours: 7,
    waterIntake: 1.5,
    stressLevel: 'medium',
    goalType: 'maintain',
  });

  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Helper function to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setUserData({
      ...userData,
      [name]: name === 'age' || name === 'weight' || name === 'height' || name === 'exerciseDays' || name === 'sleepHours' || name === 'waterIntake'
        ? parseFloat(value)
        : value,
    });
  };

  // Calculate health metrics
  const calculateMetrics = (): HealthMetrics => {
    // BMI calculation
    const heightInMeters = userData.height / 100;
    const bmi = userData.weight / (heightInMeters * heightInMeters);
    
    // BMI category
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    // BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr = 0;
    if (userData.gender === 'male') {
      bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
    } else {
      bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;
    }

    // TDEE (Total Daily Energy Expenditure)
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Heavy exercise 6-7 days/week
      veryActive: 1.9,     // Very heavy exercise, physical job or training twice a day
    };
    
    const tdee = bmr * activityMultipliers[userData.activityLevel];
    
    // Protein recommendation (g/kg of body weight)
    const proteinMultipliers = {
      sedentary: 0.8,
      light: 1.0,
      moderate: 1.2,
      active: 1.6,
      veryActive: 2.0,
    };
    const proteinNeed = userData.weight * proteinMultipliers[userData.activityLevel];
    
    // Water recommendation (ml per calorie + activity adjustment)
    const baseWater = tdee * 0.033; // about 33ml per calorie burned
    const exerciseAddition = 0.5 * userData.exerciseDays / 7; // additional 0.5L on workout days
    const waterNeed = baseWater + exerciseAddition;
    
    // Ideal weight (Hamwi formula)
    let idealWeight = 0;
    if (userData.gender === 'male') {
      idealWeight = 48 + 2.7 * (userData.height - 152.4) / 2.54;
    } else {
      idealWeight = 45.5 + 2.2 * (userData.height - 152.4) / 2.54;
    }
    
    // Body fat estimate (based on BMI, age, and gender - very rough estimation)
    let bodyFatEstimate = 0;
    if (userData.gender === 'male') {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * userData.age) - 16.2;
    } else {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * userData.age) - 5.4;
    }
    bodyFatEstimate = Math.max(5, Math.min(50, bodyFatEstimate)); // Clamp between 5-50%
    
    // Sleep recommendation
    let sleepRecommendation = 0;
    if (userData.age < 18) sleepRecommendation = 9;
    else if (userData.age < 65) sleepRecommendation = 8;
    else sleepRecommendation = 7.5;
    
    // Adjust for stress level
    if (userData.stressLevel === 'high') sleepRecommendation += 0.5;
    
    // Calorie goal based on user goal
    let calorieGoal = tdee;
    switch (userData.goalType) {
      case 'lose':
        calorieGoal = tdee - 500; // 500 calorie deficit for weight loss
        break;
      case 'gain':
        calorieGoal = tdee + 500; // 500 calorie surplus for weight gain
        break;
      default:
        calorieGoal = tdee; // Maintain weight
    }
    
    return {
      bmi,
      bmiCategory,
      bmr,
      tdee,
      proteinNeed,
      waterNeed,
      idealWeight,
      bodyFatEstimate,
      sleepRecommendation,
      calorieGoal,
    };
  };

  const handleCalculate = () => {
    const calculatedMetrics = calculateMetrics();
    setMetrics(calculatedMetrics);
    setShowResults(true);
  };

  const goToNextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleCalculate();
  };

  const goToPreviousStep = () => {
    if (step > 1) setStep(step - 1);
    else if (showResults) setShowResults(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Advanced Health Calculator</h1>
      
      {!showResults ? (
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <p className="text-gray-600">Step {step} of 3</p>
            <div className="flex gap-2">
              <div className={`h-2 w-16 rounded ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-16 rounded ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-16 rounded ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={userData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={userData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={userData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={userData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Activity & Lifestyle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                  <select 
                    name="activityLevel" 
                    value={userData.activityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sedentary">Sedentary (office job, little exercise)</option>
                    <option value="light">Light (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                    <option value="active">Active (heavy exercise 6-7 days/week)</option>
                    <option value="veryActive">Very Active (athlete, physical job)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days of Exercise Per Week</label>
                  <input 
                    type="number" 
                    name="exerciseDays" 
                    min="0" 
                    max="7" 
                    value={userData.exerciseDays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Sleep (hours/day)</label>
                  <input 
                    type="number" 
                    name="sleepHours" 
                    min="0" 
                    max="24" 
                    step="0.5" 
                    value={userData.sleepHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level</label>
                  <select 
                    name="stressLevel" 
                    value={userData.stressLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low (rarely feel stressed)</option>
                    <option value="medium">Medium (occasionally stressed)</option>
                    <option value="high">High (frequently stressed)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Goals & Current Habits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <select 
                    name="goalType" 
                    value={userData.goalType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="maintain">Maintain Weight</option>
                    <option value="lose">Lose Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Water Intake (liters/day)</label>
                  <input 
                    type="number" 
                    name="waterIntake" 
                    min="0" 
                    step="0.1" 
                    value={userData.waterIntake}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button 
                onClick={goToPreviousStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            <button 
              onClick={goToNextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {step === 3 ? 'Calculate' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Metrics */}
              <div className="bg-indigo-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-indigo-800">Key Health Metrics</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">BMI</h3>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            metrics.bmiCategory === 'Normal weight' ? 'bg-green-500' : 
                            metrics.bmiCategory === 'Underweight' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${Math.min(100, (metrics.bmi / 40) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="mt-1 flex justify-between">
                      <span className="text-gray-600">{metrics.bmi.toFixed(1)}</span>
                      <span className={`font-medium ${
                        metrics.bmiCategory === 'Normal weight' ? 'text-green-600' : 
                        metrics.bmiCategory === 'Underweight' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{metrics.bmiCategory}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Daily Calories</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">BMR</p>
                        <p className="text-xl font-bold">{Math.round(metrics.bmr)} kcal</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">TDEE</p>
                        <p className="text-xl font-bold">{Math.round(metrics.tdee)} kcal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Body Composition</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">Current Weight</p>
                        <p className="text-xl font-bold">{userData.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ideal Weight</p>
                        <p className="text-xl font-bold">{Math.round(metrics.idealWeight)} kg</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Est. Body Fat</p>
                      <p className="text-xl font-bold">{metrics.bodyFatEstimate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-indigo-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-indigo-800">Personalized Recommendations</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Caloric Goal</h3>
                    <p className="text-gray-700">Based on your {userData.goalType} weight goal:</p>
                    <p className="text-xl font-bold mt-1">{Math.round(metrics.calorieGoal)} kcal/day</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Water Intake</h3>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (userData.waterIntake / metrics.waterNeed) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">Current: {userData.waterIntake}L</span>
                      <span className="text-sm font-medium text-blue-600">Target: {metrics.waterNeed.toFixed(1)}L</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-700">
                      {userData.waterIntake < metrics.waterNeed * 0.8 ? 
                        `Try to increase your water intake by ${(metrics.waterNeed - userData.waterIntake).toFixed(1)}L per day.` :
                        userData.waterIntake > metrics.waterNeed * 1.2 ?
                        "Your water intake is higher than recommended, which is generally fine if you feel comfortable." :
                        "You're drinking a good amount of water for your needs!"
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Protein Recommendation</h3>
                    <p className="text-xl font-bold mt-1">{Math.round(metrics.proteinNeed)} g/day</p>
                    <p className="text-sm mt-1 text-gray-700">
                      This amounts to approximately {(metrics.proteinNeed / userData.weight).toFixed(1)}g of protein per kg of body weight.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Sleep Recommendation</h3>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            userData.sleepHours >= metrics.sleepRecommendation * 0.9 ? 'bg-green-500' : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${Math.min(100, (userData.sleepHours / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">Current: {userData.sleepHours}h</span>
                      <span className="text-sm font-medium text-green-600">Target: {metrics.sleepRecommendation}h</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-700">
                      {userData.sleepHours < metrics.sleepRecommendation * 0.9 ? 
                        `Try to get ${(metrics.sleepRecommendation - userData.sleepHours).toFixed(1)} more hours of sleep.` :
                        "You're getting a good amount of sleep!"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Lifestyle Tips */}
              <div className="lg:col-span-2 bg-indigo-50 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-indigo-800">Personalized Health Tips</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">Diet</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Aim for {Math.round(metrics.calorieGoal)} calories daily</li>
                      <li>• Target {Math.round(metrics.proteinNeed)}g of protein</li>
                      <li>• Drink {metrics.waterNeed.toFixed(1)}L of water</li>
                      {userData.goalType === 'lose' && <li>• Focus on high-protein, high-fiber foods</li>}
                      {userData.goalType === 'gain' && <li>• Include calorie-dense, nutritious foods</li>}
                      {userData.stressLevel === 'high' && <li>• Include magnesium and omega-3 rich foods</li>}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">Exercise</h3>
                    <ul className="space-y-2 text-gray-700">
                      {userData.activityLevel === 'sedentary' && <li>• Start with 20-30 min walks daily</li>}
                      {userData.activityLevel === 'light' && <li>• Aim for 150 min moderate activity weekly</li>}
                      {userData.activityLevel === 'moderate' && <li>• Mix cardio and strength training</li>}
                      {userData.activityLevel === 'active' && <li>• Focus on recovery between intense sessions</li>}
                      {userData.activityLevel === 'veryActive' && <li>• Ensure adequate recovery and nutrition</li>}
                      {userData.goalType === 'lose' && <li>• Combine cardio and resistance training</li>}
                      {userData.goalType === 'gain' && <li>• Prioritize resistance training</li>}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">Lifestyle</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Aim for {metrics.sleepRecommendation} hours of sleep</li>
                      {userData.stressLevel === 'high' && (
                        <>
                          <li>• Practice mindfulness or meditation</li>
                          <li>• Consider stress management techniques</li>
                        </>
                      )}
                      {userData.sleepHours < metrics.sleepRecommendation && <li>• Improve sleep with a consistent schedule</li>}
                      <li>• Stay hydrated throughout the day</li>
                      {userData.waterIntake < metrics.waterNeed && <li>• Set water intake reminders</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowResults(false)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Calculator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCalculator;