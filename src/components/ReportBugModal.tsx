// BugReportModal.tsx
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FiSend, FiXCircle, FiAlertTriangle } from "react-icons/fi";
import { BsFillBugFill } from "react-icons/bs";
import { cn } from "@/utils";

type BugSeverity = "low" | "medium" | "high" | "critical";
type BugType = "ui" | "functionality" | "performance" | "security" | "other";

export default function BugReportModal({
    className,
    hideLabel = true,
}: {
    className?: string;
    hideLabel?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [bugSeverity, setBugSeverity] = useState<BugSeverity>("medium");
    const [bugType, setBugType] = useState<BugType>("functionality");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stepsToReproduce, setStepsToReproduce] = useState("");
    const [email, setEmail] = useState("");
    const [allowContact, setAllowContact] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would normally send the bug report to your backend
            // Example API call:
            // await fetch('/api/bugs/report', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     title,
            //     bugType,
            //     bugSeverity,
            //     description,
            //     stepsToReproduce,
            //     email: allowContact ? email : null
            //   }),
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Reset form and close dialog
            setTitle("");
            setDescription("");
            setStepsToReproduce("");
            setEmail("");
            setBugSeverity("medium");
            setBugType("functionality");
            setAllowContact(false);
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
                <div
                    className={cn(
                        "flex items-center gap-2 py-2 px-4 rounded-lg bg-red-900/50 shadow-input active:shadow-inset cursor-pointer hover:bg-red-900/70 transition-colors",
                        className
                    )}
                >
                    <BsFillBugFill size={20} className="text-white/50" />
                    <span
                        className={`${
                            hideLabel ? "hidden sm:block" : ""
                        }`}
                    >
                        Report Bug
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg bg-gray-900 text-gray-100 border-gray-800 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <FiAlertTriangle className="h-5 w-5 text-red-400" />
                        Report a Bug
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Help us improve by reporting any issues you encounter.
                        Detailed reports help us fix bugs faster.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label
                            htmlFor="bug-title"
                            className="text-sm font-medium text-gray-300"
                        >
                            Bug Title
                        </Label>
                        <Input
                            id="bug-title"
                            placeholder="Brief description of the issue"
                            className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-red-600 focus:border-red-600"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="bug-type"
                                className="text-sm font-medium text-gray-300"
                            >
                                Bug Type
                            </Label>
                            <Select
                                value={bugType}
                                onValueChange={(value) =>
                                    setBugType(value as BugType)
                                }
                            >
                                <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-gray-100 focus:ring-red-600 focus:border-red-600">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectItem value="ui">
                                        User Interface
                                    </SelectItem>
                                    <SelectItem value="functionality">
                                        Functionality
                                    </SelectItem>
                                    <SelectItem value="performance">
                                        Performance
                                    </SelectItem>
                                    <SelectItem value="security">
                                        Security
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label
                                htmlFor="bug-severity"
                                className="text-sm font-medium text-gray-300"
                            >
                                Severity
                            </Label>
                            <Select
                                value={bugSeverity}
                                onValueChange={(value) =>
                                    setBugSeverity(value as BugSeverity)
                                }
                            >
                                <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-gray-100 focus:ring-red-600 focus:border-red-600">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">
                                        Critical
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="bug-description"
                            className="text-sm font-medium text-gray-300"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="bug-description"
                            placeholder="Describe the bug in detail..."
                            className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none min-h-24 focus:ring-red-600 focus:border-red-600"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="steps-to-reproduce"
                            className="text-sm font-medium text-gray-300"
                        >
                            Steps to Reproduce
                        </Label>
                        <Textarea
                            id="steps-to-reproduce"
                            placeholder="1. Go to...\n2. Click on...\n3. Observe..."
                            className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none min-h-24 focus:ring-red-600 focus:border-red-600"
                            value={stepsToReproduce}
                            onChange={(e) =>
                                setStepsToReproduce(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="allow-contact"
                                checked={allowContact}
                                onCheckedChange={(checked) =>
                                    setAllowContact(checked as boolean)
                                }
                                className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                            />
                            <Label
                                htmlFor="allow-contact"
                                className="text-sm font-medium text-gray-300"
                            >
                                Allow us to contact you about this bug
                            </Label>
                        </div>

                        {allowContact && (
                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="mt-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-red-600 focus:border-red-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={allowContact}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    We&apos;ll only use this to follow up on your bug
                                    report.
                                </p>
                            </div>
                        )}
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
                            disabled={
                                isSubmitting ||
                                !title ||
                                !description ||
                                !stepsToReproduce ||
                                (allowContact && !email)
                            }
                            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 focus:ring-red-500"
                        >
                            <FiSend className="h-4 w-4" />
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Bug Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
