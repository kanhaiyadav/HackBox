'use client';

import React, { useState } from 'react';
import type { JSX } from 'react';
import { 
  FaCalculator, 
  FaPercentage, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaRegClock,
  FaCalendarAlt,
  FaExchangeAlt,
  FaTags,
  FaRegChartBar
} from 'react-icons/fa';

// Types
type CalculatorType = 'simple-interest' | 'compound-interest' | 'loan-emi' | 'investment' | 'retirement' | 'inflation' | 'currency' | 'tax' | 'cash-flow';

interface CalcResult {
  title: string;
  value: string | JSX.Element;
}

const FinanceCalculator: React.FC = () => {
    // State for calculator mode
    const [activeTab, setActiveTab] =
        useState<CalculatorType>("simple-interest");

    // Form states for different calculators
    const [simpleInterest, setSimpleInterest] = useState({
        principal: 10000,
        rate: 5,
        time: 1,
    });

    const [compoundInterest, setCompoundInterest] = useState({
        principal: 10000,
        rate: 8,
        time: 5,
        frequency: 1, // 1 = annual, 4 = quarterly, 12 = monthly
    });

    const [loanEmi, setLoanEmi] = useState({
        principal: 100000,
        rate: 9,
        time: 5, // years
        downPayment: 0,
    });

    const [investment, setInvestment] = useState({
        initialAmount: 5000,
        monthlyContribution: 500,
        rate: 8,
        time: 10,
        frequency: 12, // monthly
    });

    const [retirement, setRetirement] = useState({
        currentAge: 30,
        retirementAge: 60,
        lifeExpectancy: 85,
        currentSavings: 50000,
        monthlyContribution: 1000,
        expectedReturn: 7,
        inflationRate: 3,
        desiredMonthlyIncome: 5000,
    });

    const [inflation, setInflation] = useState({
        presentValue: 1000,
        inflationRate: 3,
        years: 10,
    });

    const [currency, setCurrency] = useState({
        amount: 1000,
        fromCurrency: "USD",
        toCurrency: "EUR",
        exchangeRate: 0.92,
    });

    const [tax, setTax] = useState({
        income: 75000,
        deductions: 12000,
        taxRate: 24,
    });

    const [cashFlow, setCashFlow] = useState({
        initialInvestment: 50000,
        yearlyRevenue: [10000, 12000, 15000, 18000, 20000],
        yearlyExpenses: [5000, 5500, 6000, 6500, 7000],
        discountRate: 5,
    });

    // Results
    const [results, setResults] = useState<CalcResult[]>([]);

    // Handle changes for different forms
    const handleChangeSimple = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSimpleInterest((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleChangeCompound = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCompoundInterest((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleChangeLoan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoanEmi((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleChangeInvestment = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setInvestment((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleChangeRetirement = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRetirement((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleChangeInflation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInflation((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleChangeCurrency = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCurrency((prev) => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleChangeTax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTax((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleChangeCashFlow = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
        type?: "revenue" | "expenses"
    ) => {
        const { name, value } = e.target;

        if (type && index !== undefined) {
            setCashFlow((prev) => {
                const newArray = [
                    ...prev[
                        type === "revenue" ? "yearlyRevenue" : "yearlyExpenses"
                    ],
                ];
                newArray[index] = parseFloat(value) || 0;
                return {
                    ...prev,
                    [type === "revenue" ? "yearlyRevenue" : "yearlyExpenses"]:
                        newArray,
                };
            });
        } else {
            setCashFlow((prev) => ({
                ...prev,
                [name]: parseFloat(value) || 0,
            }));
        }
    };

    // Calculation functions
    const calculateSimpleInterest = () => {
        const { principal, rate, time } = simpleInterest;
        const interest = (principal * rate * time) / 100;
        const totalAmount = principal + interest;

        setResults([
            {
                title: "Principal Amount",
                value: `$${principal.toLocaleString()}`,
            },
            { title: "Interest Rate", value: `${rate}%` },
            {
                title: "Time Period",
                value: `${time} ${time === 1 ? "year" : "years"}`,
            },
            {
                title: "Interest Amount",
                value: `$${interest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Total Amount",
                value: `$${totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
        ]);
    };

    const calculateCompoundInterest = () => {
        const { principal, rate, time, frequency } = compoundInterest;
        const n = frequency; // Compounds per year
        const r = rate / 100; // Convert to decimal
        const nt = n * time;

        const amount = principal * Math.pow(1 + r / n, nt);
        const interest = amount - principal;

        // Years to double formula: ln(2) / ln(1 + r/n) / n
        const yearsToDouble = Math.log(2) / Math.log(1 + r / n) / n;

        setResults([
            {
                title: "Principal Amount",
                value: `$${principal.toLocaleString()}`,
            },
            { title: "Interest Rate", value: `${rate}%` },
            {
                title: "Time Period",
                value: `${time} ${time === 1 ? "year" : "years"}`,
            },
            {
                title: "Compounding",
                value: `${
                    frequency === 1
                        ? "Annual"
                        : frequency === 2
                        ? "Semi-annual"
                        : frequency === 4
                        ? "Quarterly"
                        : frequency === 12
                        ? "Monthly"
                        : "Daily"
                }`,
            },
            {
                title: "Interest Amount",
                value: `$${interest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Total Amount",
                value: `$${amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Years to Double",
                value: `${yearsToDouble.toFixed(2)} years`,
            },
        ]);
    };

    const calculateLoanEmi = () => {
        const { principal, rate, time, downPayment } = loanEmi;
        const loan = principal - downPayment;
        const monthlyRate = rate / 12 / 100;
        const months = time * 12;

        // EMI = [P × R × (1+R)^N]/[(1+R)^N-1]
        const emi =
            (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - loan;

        const amortizationSchedule = [];
        let balance = loan;
        let totalPrincipalPaid = 0;
        let totalInterestPaid = 0;

        // Create first five entries of amortization schedule
        for (let month = 1; month <= Math.min(5, months); month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = emi - interestPayment;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            totalPrincipalPaid += principalPayment;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            totalInterestPaid += interestPayment;
            balance -= principalPayment;

            amortizationSchedule.push({
                month,
                payment: emi,
                principal: principalPayment,
                interest: interestPayment,
                balance: balance > 0 ? balance : 0,
            });
        }

        setResults([
            { title: "Loan Amount", value: `$${loan.toLocaleString()}` },
            { title: "Interest Rate", value: `${rate}%` },
            {
                title: "Loan Term",
                value: `${time} ${
                    time === 1 ? "year" : "years"
                } (${months} months)`,
            },
            {
                title: "Monthly EMI",
                value: `$${emi.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Total Payment",
                value: `$${totalPayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Total Interest",
                value: `$${totalInterest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Initial Amortization",
                value: (
                    <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-1">Month</th>
                                    <th className="p-1">Payment</th>
                                    <th className="p-1">Principal</th>
                                    <th className="p-1">Interest</th>
                                    <th className="p-1">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {amortizationSchedule.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-gray-800"
                                                : "bg-gray-900"
                                        }
                                    >
                                        <td className="p-1 text-center">
                                            {item.month}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.payment.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.principal.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.interest.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.balance.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ),
            },
        ]);
    };

    const calculateInvestment = () => {
        const { initialAmount, monthlyContribution, rate, time, frequency } =
            investment;
        const periodsPerYear = frequency;
        const totalPeriods = time * periodsPerYear;
        const ratePerPeriod = rate / 100 / periodsPerYear;

        // Formula for Future Value with Regular Contributions
        // FV = P(1+r)^n + PMT * ((1+r)^n - 1) / r
        const futureValueInitial =
            initialAmount * Math.pow(1 + ratePerPeriod, totalPeriods);
        const futureValueContributions =
            (monthlyContribution *
                (Math.pow(1 + ratePerPeriod, totalPeriods) - 1)) /
            ratePerPeriod;
        const totalFutureValue = futureValueInitial + futureValueContributions;

        const totalInvested =
            initialAmount + monthlyContribution * totalPeriods;
        const totalInterest = totalFutureValue - totalInvested;

        // Create a year-by-year breakdown
        const yearlyBreakdown = [];
        let runningTotal = initialAmount;

        for (let year = 1; year <= Math.min(5, time); year++) {
            const yearStart = runningTotal;

            for (let period = 1; period <= periodsPerYear; period++) {
                // Interest earned this period
                const interest = runningTotal * ratePerPeriod;
                // Add interest and contribution
                runningTotal = runningTotal + interest + monthlyContribution;
            }

            yearlyBreakdown.push({
                year,
                startBalance: yearStart,
                endBalance: runningTotal,
                yearlyContribution: monthlyContribution * periodsPerYear,
                yearlyInterest:
                    runningTotal -
                    yearStart -
                    monthlyContribution * periodsPerYear,
            });
        }

        setResults([
            {
                title: "Initial Investment",
                value: `$${initialAmount.toLocaleString()}`,
            },
            {
                title: "Monthly Contribution",
                value: `$${monthlyContribution.toLocaleString()}`,
            },
            { title: "Annual Return Rate", value: `${rate}%` },
            {
                title: "Investment Period",
                value: `${time} ${time === 1 ? "year" : "years"}`,
            },
            {
                title: "Total Invested Amount",
                value: `$${totalInvested.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Total Interest Earned",
                value: `$${totalInterest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Future Value",
                value: `$${totalFutureValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Year-by-Year Breakdown",
                value: (
                    <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-1">Year</th>
                                    <th className="p-1">Start Balance</th>
                                    <th className="p-1">Contributions</th>
                                    <th className="p-1">Interest</th>
                                    <th className="p-1">End Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearlyBreakdown.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-gray-800"
                                                : "bg-gray-900"
                                        }
                                    >
                                        <td className="p-1 text-center">
                                            {item.year}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.startBalance.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            $
                                            {item.yearlyContribution.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.yearlyInterest.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.endBalance.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ),
            },
        ]);
    };

    const calculateRetirement = () => {
        const {
            currentAge,
            retirementAge,
            lifeExpectancy,
            currentSavings,
            monthlyContribution,
            expectedReturn,
            inflationRate,
            desiredMonthlyIncome,
        } = retirement;

        const yearsToRetirement = retirementAge - currentAge;
        const yearsInRetirement = lifeExpectancy - retirementAge;

        // Calculate future value of current savings at retirement
        const realReturnRate =
            (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
        const futureValueCurrentSavings =
            currentSavings * Math.pow(1 + realReturnRate, yearsToRetirement);

        // Calculate future value of regular contributions until retirement
        const monthlyRealReturn = Math.pow(1 + realReturnRate, 1 / 12) - 1;
        const futureValueContributions =
            monthlyContribution *
            ((Math.pow(1 + monthlyRealReturn, yearsToRetirement * 12) - 1) /
                monthlyRealReturn);

        // Total savings at retirement
        const totalRetirementSavings =
            futureValueCurrentSavings + futureValueContributions;

        // Inflation-adjusted monthly income needed at retirement
        const inflationAdjustedIncome =
            desiredMonthlyIncome *
            Math.pow(1 + inflationRate / 100, yearsToRetirement);

        // Amount needed to sustain retirement
        // Using the formula for present value of an annuity
        const monthlyRealReturnDuringRetirement =
            Math.pow(1 + realReturnRate, 1 / 12) - 1;
        const monthsInRetirement = yearsInRetirement * 12;

        // PV = PMT * (1 - (1 + r)^-n) / r
        const amountNeededForRetirement =
            (inflationAdjustedIncome *
                (1 -
                    Math.pow(
                        1 + monthlyRealReturnDuringRetirement,
                        -monthsInRetirement
                    ))) /
            monthlyRealReturnDuringRetirement;

        // Calculate shortfall or surplus
        const retirementGap =
            totalRetirementSavings - amountNeededForRetirement;

        // Calculate additional monthly contribution needed to close gap (if there's a shortfall)
        let additionalMonthlyContribution = 0;
        if (retirementGap < 0) {
            // Additional monthly contribution = Future Value / ((1+r)^n - 1) / r
            additionalMonthlyContribution =
                Math.abs(retirementGap) /
                ((Math.pow(1 + monthlyRealReturn, yearsToRetirement * 12) - 1) /
                    monthlyRealReturn);
        }

        setResults([
            {
                title: "Years Until Retirement",
                value: `${yearsToRetirement} years`,
            },
            {
                title: "Expected Retirement Duration",
                value: `${yearsInRetirement} years`,
            },
            {
                title: "Current Savings (Future Value)",
                value: `$${futureValueCurrentSavings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Value of Monthly Contributions",
                value: `$${futureValueContributions.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Projected Retirement Savings",
                value: `$${totalRetirementSavings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Monthly Income Needed (Inflation Adjusted)",
                value: `$${inflationAdjustedIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Retirement Fund Needed",
                value: `$${amountNeededForRetirement.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Retirement Gap",
                value: `$${Math.abs(retirementGap).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} ${retirementGap >= 0 ? "Surplus" : "Shortfall"}`,
            },
            {
                title: "Action Needed",
                value:
                    retirementGap >= 0
                        ? "You are on track for your retirement goals!"
                        : `Additional monthly contribution needed: $${additionalMonthlyContribution.toLocaleString(
                              undefined,
                              {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              }
                          )}`,
            },
        ]);
    };

    const calculateInflation = () => {
        const { presentValue, inflationRate, years } = inflation;

        // Future value calculation with inflation
        const futureValue =
            presentValue * Math.pow(1 + inflationRate / 100, years);
        const purchasingPowerLost = futureValue - presentValue;
        const purchasingPowerPercentage = (presentValue / futureValue) * 100;

        // Create a year-by-year breakdown for first 5 years or less
        const yearlyBreakdown = [];
        for (let year = 1; year <= Math.min(5, years); year++) {
            const value =
                presentValue * Math.pow(1 + inflationRate / 100, year);
            yearlyBreakdown.push({
                year,
                value,
                cumulativeInflation: (value / presentValue - 1) * 100,
            });
        }

        // Rule of 72 for inflation
        const yearsToHalveValue = 72 / inflationRate;

        setResults([
            {
                title: "Present Value",
                value: `$${presentValue.toLocaleString()}`,
            },
            { title: "Annual Inflation Rate", value: `${inflationRate}%` },
            {
                title: "Time Period",
                value: `${years} ${years === 1 ? "year" : "years"}`,
            },
            {
                title: "Future Value",
                value: `$${futureValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Purchasing Power Lost",
                value: `$${purchasingPowerLost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Remaining Purchasing Power",
                value: `${purchasingPowerPercentage.toFixed(2)}%`,
            },
            {
                title: "Years to Halve Value",
                value: `${yearsToHalveValue.toFixed(1)} years`,
            },
            {
                title: "Year-by-Year Breakdown",
                value: (
                    <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-1">Year</th>
                                    <th className="p-1">Value</th>
                                    <th className="p-1">
                                        Cumulative Inflation
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearlyBreakdown.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-gray-800"
                                                : "bg-gray-900"
                                        }
                                    >
                                        <td className="p-1 text-center">
                                            {item.year}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.value.toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            {item.cumulativeInflation.toFixed(
                                                2
                                            )}
                                            %
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ),
            },
        ]);
    };

    const calculateCurrency = () => {
        const { amount, fromCurrency, toCurrency, exchangeRate } = currency;

        const convertedAmount = amount * exchangeRate;
        const inverseRate = 1 / exchangeRate;

        setResults([
            {
                title: "Original Amount",
                value: `${fromCurrency} ${amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Exchange Rate",
                value: `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`,
            },
            {
                title: "Inverse Rate",
                value: `1 ${toCurrency} = ${inverseRate.toFixed(
                    6
                )} ${fromCurrency}`,
            },
            {
                title: "Converted Amount",
                value: `${toCurrency} ${convertedAmount.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}`,
            },
        ]);
    };

    const calculateTax = () => {
        const { income, deductions, taxRate } = tax;

        const taxableIncome = Math.max(0, income - deductions);
        const taxAmount = taxableIncome * (taxRate / 100);
        const effectiveTaxRate = (taxAmount / income) * 100;
        const netIncome = income - taxAmount;

        setResults([
            { title: "Gross Income", value: `$${income.toLocaleString()}` },
            { title: "Deductions", value: `$${deductions.toLocaleString()}` },
            {
                title: "Taxable Income",
                value: `$${taxableIncome.toLocaleString()}`,
            },
            { title: "Tax Rate", value: `${taxRate}%` },
            {
                title: "Tax Amount",
                value: `$${taxAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Effective Tax Rate",
                value: `${effectiveTaxRate.toFixed(2)}%`,
            },
            {
                title: "Net Income",
                value: `$${netIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
        ]);
    };

    const calculateCashFlow = () => {
        const {
            initialInvestment,
            yearlyRevenue,
            yearlyExpenses,
            discountRate,
        } = cashFlow;

        // Calculate net cash flows
        const netCashFlows = yearlyRevenue.map(
            (rev, idx) => rev - yearlyExpenses[idx]
        );

        // Calculate NPV
        let npv = -initialInvestment;
        netCashFlows.forEach((flow, idx) => {
            npv += flow / Math.pow(1 + discountRate / 100, idx + 1);
        });

        // Calculate IRR using approximation
        // This is a simple approximation - for production, use a more robust algorithm
        let irr = 0;
        const step = 0.1;
        const maxIterations = 1000;
        let iteration = 0;

        while (iteration < maxIterations) {
            let npvAtGuess = -initialInvestment;
            netCashFlows.forEach((flow, idx) => {
                npvAtGuess += flow / Math.pow(1 + irr / 100, idx + 1);
            });

            if (Math.abs(npvAtGuess) < 0.1) break;

            if (npvAtGuess > 0) {
                irr += step;
            } else {
                irr -= step;
                break;
            }

            iteration++;
        }

        // Calculate Payback Period
        let cumulativeCashFlow = -initialInvestment;
        let paybackPeriod = 0;
        let fullPaybackAchieved = false;

        for (let i = 0; i < netCashFlows.length; i++) {
            cumulativeCashFlow += netCashFlows[i];
            if (cumulativeCashFlow >= 0 && !fullPaybackAchieved) {
                // If this is the first period where we go positive
                if (i > 0 && cumulativeCashFlow - netCashFlows[i] < 0) {
                    // Calculate fractional year
                    const previousBalance =
                        cumulativeCashFlow - netCashFlows[i];
                    const fractionYear =
                        Math.abs(previousBalance) / netCashFlows[i];
                    paybackPeriod = i + fractionYear;
                } else {
                    paybackPeriod = i + 1;
                }
                fullPaybackAchieved = true;
            }
        }

        // Create cash flow table
        const cashFlowTable = [];
        let cumulative = -initialInvestment;

        // Add initial investment
        cashFlowTable.push({
            year: 0,
            revenue: 0,
            expenses: 0,
            netCashFlow: -initialInvestment,
            discountFactor: 1,
            pv: -initialInvestment,
            cumulative,
        });

        // Add yearly cash flows
        for (let i = 0; i < netCashFlows.length; i++) {
            const discountFactor = 1 / Math.pow(1 + discountRate / 100, i + 1);
            const pv = netCashFlows[i] * discountFactor;
            cumulative += netCashFlows[i];

            cashFlowTable.push({
                year: i + 1,
                revenue: yearlyRevenue[i],
                expenses: yearlyExpenses[i],
                netCashFlow: netCashFlows[i],
                discountFactor,
                pv,
                cumulative,
            });
        }

        setResults([
            {
                title: "Initial Investment",
                value: `$${initialInvestment.toLocaleString()}`,
            },
            {
                title: "Total Revenue",
                value: `$${yearlyRevenue
                    .reduce((sum, val) => sum + val, 0)
                    .toLocaleString()}`,
            },
            {
                title: "Total Expenses",
                value: `$${yearlyExpenses
                    .reduce((sum, val) => sum + val, 0)
                    .toLocaleString()}`,
            },
            {
                title: "Net Present Value (NPV)",
                value: `$${npv.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            },
            {
                title: "Internal Rate of Return (IRR)",
                value: `${irr.toFixed(2)}%`,
            },
            {
                title: "Payback Period",
                value: fullPaybackAchieved
                    ? `${paybackPeriod.toFixed(2)} years`
                    : "Not achieved within timeframe",
            },
            {
                title: "Profitability Index",
                value: `${(
                    (npv + initialInvestment) /
                    initialInvestment
                ).toFixed(2)}`,
            },
            {
                title: "Cash Flow Analysis",
                value: (
                    <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-1">Year</th>
                                    <th className="p-1">Revenue</th>
                                    <th className="p-1">Expenses</th>
                                    <th className="p-1">Net CF</th>
                                    <th className="p-1">Disc. Factor</th>
                                    <th className="p-1">PV</th>
                                    <th className="p-1">Cumulative</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cashFlowTable.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-gray-800"
                                                : "bg-gray-900"
                                        }
                                    >
                                        <td className="p-1 text-center">
                                            {item.year}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.revenue.toLocaleString()}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.expenses.toLocaleString()}
                                        </td>
                                        <td className="p-1 text-center">
                                            ${item.netCashFlow.toLocaleString()}
                                        </td>
                                        <td className="p-1 text-center">
                                            {item.discountFactor.toFixed(4)}
                                        </td>
                                        <td className="p-1 text-center">
                                            $
                                            {item.pv.toLocaleString(undefined, {
                                                maximumFractionDigits: 0,
                                            })}
                                        </td>
                                        <td
                                            className="p-1 text-center"
                                            style={{
                                                color:
                                                    item.cumulative >= 0
                                                        ? "lightgreen"
                                                        : "lightcoral",
                                            }}
                                        >
                                            $
                                            {item.cumulative.toLocaleString(
                                                undefined,
                                                { maximumFractionDigits: 0 }
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ),
            },
        ]);
    };

    // Handle calculator calculations
    const handleCalculate = () => {
        switch (activeTab) {
            case "simple-interest":
                calculateSimpleInterest();
                break;
            case "compound-interest":
                calculateCompoundInterest();
                break;
            case "loan-emi":
                calculateLoanEmi();
                break;
            case "investment":
                calculateInvestment();
                break;
            case "retirement":
                calculateRetirement();
                break;
            case "inflation":
                calculateInflation();
                break;
            case "currency":
                calculateCurrency();
                break;
            case "tax":
                calculateTax();
                break;
            case "cash-flow":
                calculateCashFlow();
                break;
        }
    };

    // Calculator components
    const renderCalculator = () => {
        switch (activeTab) {
            case "simple-interest":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Principal Amount ($)
                                </label>
                                <input
                                    type="number"
                                    name="principal"
                                    value={simpleInterest.principal}
                                    onChange={handleChangeSimple}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Interest Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={simpleInterest.rate}
                                    onChange={handleChangeSimple}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Time Period (years)
                                </label>
                                <input
                                    type="number"
                                    name="time"
                                    value={simpleInterest.time}
                                    onChange={handleChangeSimple}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "compound-interest":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Principal Amount ($)
                                </label>
                                <input
                                    type="number"
                                    name="principal"
                                    value={compoundInterest.principal}
                                    onChange={handleChangeCompound}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Interest Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={compoundInterest.rate}
                                    onChange={handleChangeCompound}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Time Period (years)
                                </label>
                                <input
                                    type="number"
                                    name="time"
                                    value={compoundInterest.time}
                                    onChange={handleChangeCompound}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Compounding Frequency
                                </label>
                                <select
                                    name="frequency"
                                    value={compoundInterest.frequency}
                                    onChange={handleChangeCompound}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Annual (1/year)</option>
                                    <option value="2">
                                        Semi-Annual (2/year)
                                    </option>
                                    <option value="4">
                                        Quarterly (4/year)
                                    </option>
                                    <option value="12">
                                        Monthly (12/year)
                                    </option>
                                    <option value="365">
                                        Daily (365/year)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case "loan-emi":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Loan Amount ($)
                                </label>
                                <input
                                    type="number"
                                    name="principal"
                                    value={loanEmi.principal}
                                    onChange={handleChangeLoan}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Interest Rate (% per year)
                                </label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={loanEmi.rate}
                                    onChange={handleChangeLoan}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Loan Term (years)
                                </label>
                                <input
                                    type="number"
                                    name="time"
                                    value={loanEmi.time}
                                    onChange={handleChangeLoan}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Down Payment ($)
                                </label>
                                <input
                                    type="number"
                                    name="downPayment"
                                    value={loanEmi.downPayment}
                                    onChange={handleChangeLoan}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "investment":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Initial Investment ($)
                                </label>
                                <input
                                    type="number"
                                    name="initialAmount"
                                    value={investment.initialAmount}
                                    onChange={handleChangeInvestment}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Monthly Contribution ($)
                                </label>
                                <input
                                    type="number"
                                    name="monthlyContribution"
                                    value={investment.monthlyContribution}
                                    onChange={handleChangeInvestment}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Expected Annual Return (%)
                                </label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={investment.rate}
                                    onChange={handleChangeInvestment}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Time Period (years)
                                </label>
                                <input
                                    type="number"
                                    name="time"
                                    value={investment.time}
                                    onChange={handleChangeInvestment}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Contribution Frequency
                                </label>
                                <select
                                    name="frequency"
                                    value={investment.frequency}
                                    onChange={handleChangeInvestment}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Annual</option>
                                    <option value="4">Quarterly</option>
                                    <option value="12">Monthly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case "retirement":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Current Age
                                </label>
                                <input
                                    type="number"
                                    name="currentAge"
                                    value={retirement.currentAge}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Retirement Age
                                </label>
                                <input
                                    type="number"
                                    name="retirementAge"
                                    value={retirement.retirementAge}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Life Expectancy
                                </label>
                                <input
                                    type="number"
                                    name="lifeExpectancy"
                                    value={retirement.lifeExpectancy}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Current Savings ($)
                                </label>
                                <input
                                    type="number"
                                    name="currentSavings"
                                    value={retirement.currentSavings}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Monthly Contribution ($)
                                </label>
                                <input
                                    type="number"
                                    name="monthlyContribution"
                                    value={retirement.monthlyContribution}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Expected Return Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="expectedReturn"
                                    value={retirement.expectedReturn}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Inflation Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="inflationRate"
                                    value={retirement.inflationRate}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Desired Monthly Income ($)
                                </label>
                                <input
                                    type="number"
                                    name="desiredMonthlyIncome"
                                    value={retirement.desiredMonthlyIncome}
                                    onChange={handleChangeRetirement}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "inflation":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Present Value ($)
                                </label>
                                <input
                                    type="number"
                                    name="presentValue"
                                    value={inflation.presentValue}
                                    onChange={handleChangeInflation}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Inflation Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="inflationRate"
                                    value={inflation.inflationRate}
                                    onChange={handleChangeInflation}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Time Period (years)
                                </label>
                                <input
                                    type="number"
                                    name="years"
                                    value={inflation.years}
                                    onChange={handleChangeInflation}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "currency":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={currency.amount}
                                    onChange={handleChangeCurrency}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    From Currency
                                </label>
                                <input
                                    type="text"
                                    name="fromCurrency"
                                    value={currency.fromCurrency}
                                    onChange={handleChangeCurrency}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    To Currency
                                </label>
                                <input
                                    type="text"
                                    name="toCurrency"
                                    value={currency.toCurrency}
                                    onChange={handleChangeCurrency}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Exchange Rate
                                </label>
                                <input
                                    type="number"
                                    name="exchangeRate"
                                    value={currency.exchangeRate}
                                    onChange={handleChangeCurrency}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "tax":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Gross Income ($)
                                </label>
                                <input
                                    type="number"
                                    name="income"
                                    value={tax.income}
                                    onChange={handleChangeTax}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deductions ($)
                                </label>
                                <input
                                    type="number"
                                    name="deductions"
                                    value={tax.deductions}
                                    onChange={handleChangeTax}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="taxRate"
                                    value={tax.taxRate}
                                    onChange={handleChangeTax}
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "cash-flow":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Initial Investment ($)
                            </label>
                            <input
                                type="number"
                                name="initialInvestment"
                                value={cashFlow.initialInvestment}
                                onChange={handleChangeCashFlow}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Discount Rate (%)
                            </label>
                            <input
                                type="number"
                                name="discountRate"
                                value={cashFlow.discountRate}
                                onChange={handleChangeCashFlow}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="border border-gray-600 rounded p-3">
                            <h3 className="text-sm font-medium mb-2">
                                Cash Flow Projections
                            </h3>

                            <div className="space-y-2">
                                {cashFlow.yearlyRevenue.map((revenue, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Year {idx + 1} Revenue ($)
                                            </label>
                                            <input
                                                type="number"
                                                value={revenue}
                                                onChange={(e) =>
                                                    handleChangeCashFlow(
                                                        e,
                                                        idx,
                                                        "revenue"
                                                    )
                                                }
                                                className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Year {idx + 1} Expenses ($)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    cashFlow.yearlyExpenses[idx]
                                                }
                                                onChange={(e) =>
                                                    handleChangeCashFlow(
                                                        e,
                                                        idx,
                                                        "expenses"
                                                    )
                                                }
                                                className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 flex items-center">
                    <FaCalculator className="mr-2" />
                    Finance Calculator
                </h1>

                {/* Calculator type tabs */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("simple-interest")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "simple-interest"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaPercentage className="mr-2" /> Simple Interest
                    </button>
                    <button
                        onClick={() => setActiveTab("compound-interest")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "compound-interest"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaChartLine className="mr-2" /> Compound Interest
                    </button>
                    <button
                        onClick={() => setActiveTab("loan-emi")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "loan-emi"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaMoneyBillWave className="mr-2" /> Loan EMI
                    </button>
                    <button
                        onClick={() => setActiveTab("investment")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "investment"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaRegChartBar className="mr-2" /> Investment
                    </button>
                    <button
                        onClick={() => setActiveTab("retirement")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "retirement"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaRegClock className="mr-2" /> Retirement
                    </button>
                    <button
                        onClick={() => setActiveTab("inflation")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "inflation"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaCalendarAlt className="mr-2" /> Inflation
                    </button>
                    <button
                        onClick={() => setActiveTab("currency")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "currency"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaExchangeAlt className="mr-2" /> Currency
                    </button>
                    <button
                        onClick={() => setActiveTab("tax")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "tax"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaTags className="mr-2" /> Tax
                    </button>
                    <button
                        onClick={() => setActiveTab("cash-flow")}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            activeTab === "cash-flow"
                                ? "bg-blue-700"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        <FaMoneyBillWave className="mr-2" /> Cash Flow
                    </button>
                </div>

                {/* Calculator form */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {activeTab === "simple-interest" &&
                            "Simple Interest Calculator"}
                        {activeTab === "compound-interest" &&
                            "Compound Interest Calculator"}
                        {activeTab === "loan-emi" && "Loan EMI Calculator"}
                        {activeTab === "investment" && "Investment Calculator"}
                        {activeTab === "retirement" && "Retirement Calculator"}
                        {activeTab === "inflation" && "Inflation Calculator"}
                        {activeTab === "currency" && "Currency Converter"}
                        {activeTab === "tax" && "Tax Calculator"}
                        {activeTab === "cash-flow" && "Cash Flow Calculator"}
                    </h2>

                    {renderCalculator()}

                    <div className="mt-6">
                        <button
                            onClick={handleCalculate}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
                        >
                            Calculate
                        </button>
                    </div>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-700 p-4 rounded-md"
                                >
                                    <h3 className="text-sm font-medium text-gray-300 mb-1">
                                        {result.title}
                                    </h3>
                                    <div className="text-lg font-semibold">
                                        {result.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceCalculator;