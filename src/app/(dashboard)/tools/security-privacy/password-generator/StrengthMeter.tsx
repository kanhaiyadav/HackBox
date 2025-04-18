"use client";

interface StrengthMeterProps {
    password: string;
}

export default function StrengthMeter({ password }: StrengthMeterProps) {
    const calculateStrength = () => {
        if (!password) return 0;

        let strength = 0;
        const { length } = password;
        strength += Math.min(50, Math.max(0, ((length - 8) / (32 - 8)) * 50));

        let varietyScore = 0;
        if (/[A-Z]/.test(password)) varietyScore += 10;
        if (/[a-z]/.test(password)) varietyScore += 10;
        if (/[0-9]/.test(password)) varietyScore += 10;
        if (/[^A-Za-z0-9]/.test(password)) varietyScore += 20;

        strength += varietyScore;
        return Math.min(100, Math.round(strength));
    };

    const getStrengthLabel = (strength: number) => {
        if (strength === 0) return "None";
        if (strength < 30) return "Weak";
        if (strength < 70) return "Moderate";
        if (strength < 90) return "Strong";
        return "Very Strong";
    };

    const getStrengthColor = (strength: number) => {
        if (strength === 0) return "bg-gray-500";
        if (strength < 30) return "bg-red-500";
        if (strength < 70) return "bg-yellow-500";
        if (strength < 90) return "bg-green-500";
        return "bg-emerald-500";
    };

    const strength = calculateStrength();

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
                <span>Password Strength:</span>
                <span className="font-medium">
                    {getStrengthLabel(strength)} ({strength}%)
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${getStrengthColor(
                        strength
                    )}`}
                    style={{ width: `${strength}%` }}
                ></div>
            </div>
        </div>
    );
}
