'use client';


import { useState, useEffect } from "react";

type Gender = "male" | "female";
type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "veryActive";
type Goal = "maintain" | "lose" | "gain";

const HealthCalculator = () => {
    // Basic user information
    const [age, setAge] = useState<number>(25);
    const [gender, setGender] = useState<Gender>("male");
    const [height, setHeight] = useState<number>(170);
    const [weight, setWeight] = useState<number>(70);
    const [neck, setNeck] = useState<number>(38);
    const [waist, setWaist] = useState<number>(80);
    const [hip, setHip] = useState<number>(95);

    // Lifestyle factors
    const [activityLevel, setActivityLevel] =
        useState<ActivityLevel>("moderate");
    const [sleepHours, setSleepHours] = useState<number>(7);
    const [stressLevel, setStressLevel] = useState<number>(3); // 1-5 scale
    const [goal, setGoal] = useState<Goal>("maintain");

    // Calculated metrics
    const [bmi, setBmi] = useState<number>(0);
    const [bodyFat, setBodyFat] = useState<number>(0);
    const [bmr, setBmr] = useState<number>(0);
    const [tdee, setTdee] = useState<number>(0);
    const [idealWeight, setIdealWeight] = useState<{
        peterson: number;
        robinson: number;
        miller: number;
    }>({ peterson: 0, robinson: 0, miller: 0 });
    const [waterIntake, setWaterIntake] = useState<number>(0);
    const [proteinIntake, setProteinIntake] = useState<{
        maintain: number;
        lose: number;
        gain: number;
    }>({ maintain: 0, lose: 0, gain: 0 });
    const [recommendations, setRecommendations] = useState<string[]>([]);

    // Calculate all metrics
    useEffect(() => {
        calculateAllMetrics();
    }, [
        age,
        gender,
        height,
        weight,
        neck,
        waist,
        hip,
        activityLevel,
        sleepHours,
        stressLevel,
        goal,
    ]);

    const calculateAllMetrics = () => {
        calculateBMI();
        calculateBodyFat();
        calculateBMR();
        calculateTDEE();
        calculateIdealWeight();
        calculateWaterIntake();
        calculateProteinIntake();
        generateRecommendations();
    };

    const calculateBMI = () => {
        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        setBmi(parseFloat(bmiValue.toFixed(1)));
    };

    const calculateBodyFat = () => {
        let bodyFatValue;
        if (gender === "male") {
            bodyFatValue =
                495 /
                    (1.0324 -
                        0.19077 * Math.log10(waist - neck) +
                        0.15456 * Math.log10(height)) -
                450;
        } else {
            bodyFatValue =
                495 /
                    (1.29579 -
                        0.35004 * Math.log10(waist + hip - neck) +
                        0.221 * Math.log10(height)) -
                450;
        }
        setBodyFat(parseFloat(bodyFatValue.toFixed(1)));
    };

    const calculateBMR = () => {
        let bmrValue;
        if (gender === "male") {
            bmrValue = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        } else {
            bmrValue = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
        }
        setBmr(parseFloat(bmrValue.toFixed(0)));
    };

    const calculateTDEE = () => {
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
        };

        const tdeeValue = bmr * activityMultipliers[activityLevel];
        setTdee(parseFloat(tdeeValue.toFixed(0)));
    };

    const calculateIdealWeight = () => {
        // Peterson formula (2016)
        const peterson =
            gender === "male"
                ? 50 + 2.3 * (height / 2.54 - 60)
                : 45.5 + 2.3 * (height / 2.54 - 60);

        // Robinson formula (1983)
        const robinson =
            gender === "male"
                ? 52 + 1.9 * (height / 2.54 - 60)
                : 49 + 1.7 * (height / 2.54 - 60);

        // Miller formula (1983)
        const miller =
            gender === "male"
                ? 56.2 + 1.41 * (height / 2.54 - 60)
                : 53.1 + 1.36 * (height / 2.54 - 60);

        setIdealWeight({
            peterson: parseFloat((peterson * 0.453592).toFixed(1)),
            robinson: parseFloat((robinson * 0.453592).toFixed(1)),
            miller: parseFloat((miller * 0.453592).toFixed(1)),
        });
    };

    const calculateWaterIntake = () => {
        // Basic water intake calculation (ml per kg of body weight)
        const baseWater = weight * 30; // 30ml per kg

        // Adjust for activity level
        let activityAdjustment = 0;
        if (activityLevel === "light") activityAdjustment = 300;
        else if (activityLevel === "moderate") activityAdjustment = 500;
        else if (activityLevel === "active") activityAdjustment = 700;
        else if (activityLevel === "veryActive") activityAdjustment = 1000;

        // Adjust for stress
        const stressAdjustment = (stressLevel - 3) * 100; // +100ml for each stress level above 3

        const totalWater = baseWater + activityAdjustment + stressAdjustment;
        setWaterIntake(parseFloat(totalWater.toFixed(0)));
    };

    const calculateProteinIntake = () => {
        // Protein in grams per kg of body weight
        const maintain = weight * 1.6; // Moderate activity
        const lose = weight * 2.2; // Higher for fat loss
        const gain = weight * 1.8; // Slightly higher for muscle gain

        setProteinIntake({
            maintain: parseFloat(maintain.toFixed(1)),
            lose: parseFloat(lose.toFixed(1)),
            gain: parseFloat(gain.toFixed(1)),
        });
    };

    const generateRecommendations = () => {
        const recs: string[] = [];

        // BMI recommendations
        if (bmi < 18.5) {
            recs.push(
                "Your BMI suggests you're underweight. Consider consulting a nutritionist for healthy weight gain strategies."
            );
        } else if (bmi >= 25 && bmi < 30) {
            recs.push(
                "Your BMI suggests you're overweight. Small dietary changes and increased activity can help reach a healthier weight."
            );
        } else if (bmi >= 30) {
            recs.push(
                "Your BMI suggests obesity. Please consult with a healthcare provider for personalized advice."
            );
        } else {
            recs.push(
                "Your BMI is in the healthy range. Maintain your current habits for continued health."
            );
        }

        // Body fat recommendations
        if (gender === "male") {
            if (bodyFat > 25) {
                recs.push(
                    `Your body fat percentage (${bodyFat}%) is above the healthy range for men (8-19% athletes, 19-25% acceptable). Consider increasing physical activity.`
                );
            } else if (bodyFat < 8) {
                recs.push(
                    `Your body fat percentage (${bodyFat}%) is very low. Ensure you're getting adequate nutrition and consult a professional if intentionally maintaining this level.`
                );
            }
        } else {
            if (bodyFat > 32) {
                recs.push(
                    `Your body fat percentage (${bodyFat}%) is above the healthy range for women (21-28% athletes, 25-32% acceptable). Consider increasing physical activity.`
                );
            } else if (bodyFat < 15) {
                recs.push(
                    `Your body fat percentage (${bodyFat}%) is very low. Ensure you're getting adequate nutrition and consult a professional if intentionally maintaining this level.`
                );
            }
        }

        // Sleep recommendations
        if (sleepHours < 7) {
            recs.push(
                `You're getting ${sleepHours} hours of sleep. Adults typically need 7-9 hours for optimal health. Consider improving your sleep hygiene.`
            );
        } else if (sleepHours > 9) {
            recs.push(
                `You're getting ${sleepHours} hours of sleep. While some need more, consistently sleeping over 9 hours may indicate underlying health issues.`
            );
        }

        // Stress recommendations
        if (stressLevel >= 4) {
            recs.push(
                "Your stress levels seem high. Consider incorporating stress-reduction techniques like meditation, exercise, or counseling."
            );
        }

        // Activity recommendations
        if (activityLevel === "sedentary") {
            recs.push(
                "Your activity level is sedentary. Aim for at least 150 minutes of moderate activity per week for health benefits."
            );
        }

        setRecommendations(recs);
    };

    const getBMICategory = () => {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal weight";
        if (bmi < 30) return "Overweight";
        return "Obese";
    };

    const getBodyFatCategory = () => {
        if (gender === "male") {
            if (bodyFat < 6) return "Essential fat";
            if (bodyFat < 14) return "Athletic";
            if (bodyFat < 18) return "Fitness";
            if (bodyFat < 25) return "Average";
            return "Obese";
        } else {
            if (bodyFat < 14) return "Essential fat";
            if (bodyFat < 21) return "Athletic";
            if (bodyFat < 25) return "Fitness";
            if (bodyFat < 32) return "Average";
            return "Obese";
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Advanced Health Calculator
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Personal Information
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Age (years)
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) =>
                                setAge(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max="120"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="gender"
                                    checked={gender === "male"}
                                    onChange={() => setGender("male")}
                                />
                                <span className="ml-2">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="gender"
                                    checked={gender === "female"}
                                    onChange={() => setGender("female")}
                                />
                                <span className="ml-2">Female</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) =>
                                setHeight(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="100"
                            max="250"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) =>
                                setWeight(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="30"
                            max="300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Neck circumference (cm)
                        </label>
                        <input
                            type="number"
                            value={neck}
                            onChange={(e) =>
                                setNeck(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="20"
                            max="60"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Waist circumference (cm)
                        </label>
                        <input
                            type="number"
                            value={waist}
                            onChange={(e) =>
                                setWaist(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="50"
                            max="200"
                        />
                    </div>

                    {gender === "female" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hip circumference (cm)
                            </label>
                            <input
                                type="number"
                                value={hip}
                                onChange={(e) =>
                                    setHip(parseInt(e.target.value) || 0)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="60"
                                max="200"
                            />
                        </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">
                        Lifestyle Factors
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Activity Level
                        </label>
                        <select
                            value={activityLevel}
                            onChange={(e) =>
                                setActivityLevel(
                                    e.target.value as ActivityLevel
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="sedentary">
                                Sedentary (little or no exercise)
                            </option>
                            <option value="light">
                                Lightly active (light exercise 1-3 days/week)
                            </option>
                            <option value="moderate">
                                Moderately active (moderate exercise 3-5
                                days/week)
                            </option>
                            <option value="active">
                                Very active (hard exercise 6-7 days/week)
                            </option>
                            <option value="veryActive">
                                Extremely active (very hard exercise & physical
                                job)
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Average Sleep (hours/night)
                        </label>
                        <input
                            type="number"
                            value={sleepHours}
                            onChange={(e) =>
                                setSleepHours(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="4"
                            max="12"
                            step="0.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stress Level (1-5 scale)
                        </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={stressLevel}
                                onChange={(e) =>
                                    setStressLevel(parseInt(e.target.value))
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-3 text-gray-700">
                                {stressLevel}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Goal
                        </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value as Goal)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="maintain">
                                Maintain current weight
                            </option>
                            <option value="lose">Lose weight/fat</option>
                            <option value="gain">Gain weight/muscle</option>
                        </select>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Your Health Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800">BMI</h3>
                            <p className="text-2xl font-bold">{bmi}</p>
                            <p className="text-sm">{getBMICategory()}</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800">
                                Body Fat %
                            </h3>
                            <p className="text-2xl font-bold">{bodyFat}%</p>
                            <p className="text-sm">{getBodyFatCategory()}</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800">BMR</h3>
                            <p className="text-2xl font-bold">{bmr} kcal</p>
                            <p className="text-sm">Calories at complete rest</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800">TDEE</h3>
                            <p className="text-2xl font-bold">{tdee} kcal</p>
                            <p className="text-sm">Daily calorie needs</p>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">
                            Ideal Weight Range (kg)
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-sm">Peterson:</p>
                                <p className="text-xl font-bold">
                                    {idealWeight.peterson}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm">Robinson:</p>
                                <p className="text-xl font-bold">
                                    {idealWeight.robinson}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm">Miller:</p>
                                <p className="text-xl font-bold">
                                    {idealWeight.miller}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-800 mb-2">
                            Daily Water Intake
                        </h3>
                        <p className="text-2xl font-bold">{waterIntake} ml</p>
                        <p className="text-sm">
                            ≈ {Math.round(waterIntake / 250)} cups (250ml each)
                        </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-800 mb-2">
                            Daily Protein Intake (grams)
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-sm">Maintain:</p>
                                <p className="text-xl font-bold">
                                    {proteinIntake.maintain}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm">Lose:</p>
                                <p className="text-xl font-bold">
                                    {proteinIntake.lose}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm">Gain:</p>
                                <p className="text-xl font-bold">
                                    {proteinIntake.gain}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-medium text-red-800 mb-2">
                            Calorie Targets
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm">
                                    Weight Loss (500kcal deficit):
                                </p>
                                <p className="text-xl font-bold">
                                    {tdee - 500} kcal
                                </p>
                            </div>
                            <div>
                                <p className="text-sm">
                                    Weight Gain (500kcal surplus):
                                </p>
                                <p className="text-xl font-bold">
                                    {tdee + 500} kcal
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="font-medium text-indigo-800 mb-2">
                            Personalized Recommendations
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="text-sm">
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthCalculator;
