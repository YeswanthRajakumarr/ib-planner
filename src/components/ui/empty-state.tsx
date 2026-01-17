import { BookOpen, Lightbulb, Target, ClipboardCheck, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    type: "concepts" | "process" | "outcomes" | "assessment" | "weekly";
    onAction?: () => void;
}

const emptyStateConfig = {
    concepts: {
        icon: BookOpen,
        title: "No concepts defined yet",
        description: "Start by adding the key concepts and topics you'll cover this month. This forms the foundation of your unit plan.",
        action: "Add First Concept",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    process: {
        icon: Lightbulb,
        title: "Learning process not mapped",
        description: "Define the teaching strategies and learning engagements that will help students master the concepts.",
        action: "Add Learning Activity",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    outcomes: {
        icon: Target,
        title: "No learning outcomes set",
        description: "Specify what students should know, understand, and be able to do by the end of this unit.",
        action: "Define Outcomes",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    assessment: {
        icon: ClipboardCheck,
        title: "Assessment plan empty",
        description: "Add formative and summative assessments to measure student progress and achievement.",
        action: "Add Assessment",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    weekly: {
        icon: CalendarDays,
        title: "Weekly schedule not planned",
        description: "Break down your month into weekly focuses to create a balanced and paced learning experience.",
        action: "Plan First Week",
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
};

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
    const config = emptyStateConfig[type];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
            <div className={`w-20 h-20 rounded-3xl ${config.bgColor} flex items-center justify-center mb-6`}>
                <Icon className={`w-10 h-10 ${config.color}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{config.title}</h3>
            <p className="text-muted-foreground max-w-md mb-6 text-sm leading-relaxed">
                {config.description}
            </p>
            {onAction && (
                <Button
                    onClick={onAction}
                    className="rounded-full shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    {config.action}
                </Button>
            )}
        </div>
    );
};
