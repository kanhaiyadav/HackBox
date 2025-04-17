// FeedbackModal.tsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FiMessageSquare, FiSend, FiXCircle } from "react-icons/fi";
import { VscFeedback } from "react-icons/vsc";


type FeedbackType = "suggestion" | "bug" | "compliment" | "other";

export default function FeedbackModal() {
    const [open, setOpen] = useState(false);
    const [feedbackType, setFeedbackType] =
        useState<FeedbackType>("suggestion");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would normally send the feedback to your backend
            // Example API call:
            // await fetch('/api/feedback', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ feedbackType, message, email }),
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Reset form and close dialog
            setMessage("");
            setEmail("");
            setFeedbackType("suggestion");
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer">
                    <VscFeedback size={20} className="text-white/50" />
                    <span className="hidden sm:block">Feedback</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg bg-gray-900 text-gray-100 border-gray-800 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <FiMessageSquare className="h-5 w-5" />
                        Share Your Feedback
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        We value your input to improve our product. Your
                        feedback matters to us.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="feedback-type"
                                className="text-sm font-medium text-gray-300"
                            >
                                Feedback Type
                            </Label>
                            <RadioGroup
                                id="feedback-type"
                                value={feedbackType}
                                onValueChange={(value) =>
                                    setFeedbackType(value as FeedbackType)
                                }
                                className="grid grid-cols-2 gap-4 mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="suggestion"
                                        id="suggestion"
                                        className="border-gray-700"
                                    />
                                    <Label
                                        htmlFor="suggestion"
                                        className="text-gray-300"
                                    >
                                        Suggestion
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="bug"
                                        id="bug"
                                        className="border-gray-700"
                                    />
                                    <Label
                                        htmlFor="bug"
                                        className="text-gray-300"
                                    >
                                        Bug Report
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="compliment"
                                        id="compliment"
                                        className="border-gray-700"
                                    />
                                    <Label
                                        htmlFor="compliment"
                                        className="text-gray-300"
                                    >
                                        Compliment
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="other"
                                        id="other"
                                        className="border-gray-700"
                                    />
                                    <Label
                                        htmlFor="other"
                                        className="text-gray-300"
                                    >
                                        Other
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label
                                htmlFor="message"
                                className="text-sm font-medium text-gray-300"
                            >
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us what you think..."
                                className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none min-h-32 focus:ring-blue-600 focus:border-blue-600"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-300"
                            >
                                Email (optional)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-600 focus:border-blue-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave your email if you&apos;d like us to follow
                                up on your feedback.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex sm:justify-between gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300"
                        >
                            <FiXCircle className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !message}
                            className="flex items-center gap-2"
                        >
                            <FiSend className="h-4 w-4" />
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
