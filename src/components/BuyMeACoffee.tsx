"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaHeart, FaPaypal, FaCreditCard } from "react-icons/fa";
import { SiKofi, SiBuymeacoffee } from "react-icons/si";
import { AnimatedInput } from "./AnimatedInput";
import { cn } from "@/utils";

interface BuyMeCoffeeModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    className?: string;
}

export default function BuyMeCoffeeModal({
    isOpen,
    onClose,
    className
}: BuyMeCoffeeModalProps) {
    const [amount, setAmount] = useState<number>(5);
    const [message, setMessage] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset form after showing success message
            setTimeout(() => {
                setIsSuccess(false);
                setAmount(5);
                setMessage("");
                setPaymentMethod("paypal");
                if (onClose) onClose();
            }, 2000);
        }, 1500);
    };

    const presetAmounts = [3, 5, 10];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <div className={cn("flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer", className)}>
                    <SiBuymeacoffee size={20} className="text-white/50" />
                    <span className="font-stylish relative bottom-[-5px] hidden sm:block">Buy me a coffee</span>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 text-slate-100 border-slate-700 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <SiBuymeacoffee className="text-primary" />
                        <span>Buy Me a Coffee</span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                        Support my work with a virtual coffee! Your generosity
                        helps keep the projects going.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-6 flex flex-col items-center justify-center">
                        <div className="bg-slate-800 p-4 rounded-full mb-4">
                            <FaHeart className="text-4xl text-rose-50" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary">
                            Thank You!
                        </h3>
                        <p className="text-slate-300 text-center mt-2">
                            Your coffee means a lot! I really appreciate your
                            support.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="amount"
                                    className="text-slate-300"
                                >
                                    Coffee Amount
                                </Label>
                                <div className="flex gap-2 mt-2">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`flex-1 rounded-md ${
                                                amount === preset
                                                    ? "bg-primary/10 border-1 border-primary text-primary"
                                                    : "bg-accent text-slate- border-1 border-input hover:bg-primary/10 hover:border-primary hover:text-primary"
                                            }`}
                                        >
                                            ${preset}
                                        </button>
                                    ))}
                                    <div className="flex-1">
                                        <Input
                                            id="amount"
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            className="bg-slate-800 border-slate-700 text-slate-100 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <AnimatedInput
                                    label="Leave a message"
                                    placeholder=""
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-2 bg-slate-800 border-slate-700 text-slate-100"
                                />
                            </div>

                            <div>
                                <Label className="text-slate-300">
                                    Payment Method
                                </Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setPaymentMethod("paypal")
                                        }
                                        variant={
                                            paymentMethod === "paypal"
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`flex items-center justify-center gap-2 ${
                                            paymentMethod === "paypal"
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                                        }`}
                                    >
                                        <FaPaypal />
                                        <span>PayPal</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setPaymentMethod("card")}
                                        variant={
                                            paymentMethod === "card"
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`flex items-center justify-center gap-2 ${
                                            paymentMethod === "card"
                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                                        }`}
                                    >
                                        <FaCreditCard />
                                        <span>Card</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col space-y-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting || amount <= 0}
                                className="bg-primary hover:bg-primary/80 text-black transition-all w-full py-6 text-lg"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <SiBuymeacoffee />
                                        Buy{" "}
                                        {amount > 1
                                            ? `${amount} Coffees`
                                            : "a Coffee"}{" "}
                                        (${amount})
                                    </span>
                                )}
                            </Button>

                            <div className="flex justify-center gap-4 text-slate-400">
                                <SiBuymeacoffee className="text-lg" />
                                <SiKofi className="text-lg" />
                            </div>
                        </div>
                    </form>
                )}

                <DialogFooter className="border-t border-slate-800 pt-4 mt-4">
                    <p className="text-xs text-slate-400 text-center w-full">
                        Secured by{" "}
                        <span className="font-semibold">CoffeePay</span> • All
                        transactions are secure and encrypted
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
