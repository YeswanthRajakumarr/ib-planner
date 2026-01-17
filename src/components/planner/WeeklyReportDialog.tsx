import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, BookOpen, Target, ClipboardCheck, Calendar, MessageSquare } from "lucide-react";

// Using the same WeekData structure from WeeklyPlanSection
interface WeekData {
  id: string;
  week: number;
  focus: string;
  activities: string;
  outcomes: string;
  assessments: string;
  linkedConcept?: string;
  linkedTopic?: string;
}

interface WeekReport {
  weekId: string;
  activitiesCompleted: boolean;
  assessmentsCompleted: boolean;
  notes: string;
}

interface WeeklyReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  subjectName: string;
}

// Mock weekly plans data - matches WeeklyPlanSection structure
const mockWeeklyPlans: WeekData[] = [
  {
    id: "1",
    week: 1,
    focus: "Introduction to Nouns",
    activities: "Visual categorization activity, noun identification in passages, group discussion on noun types",
    outcomes: "Students identify common and proper nouns with 85% accuracy",
    assessments: "Informal observation, exit ticket",
    linkedConcept: "Nouns",
    linkedTopic: "Common Nouns",
  },
  {
    id: "2",
    week: 2,
    focus: "Pronouns and Agreement",
    activities: "Pronoun substitution exercises, peer editing for pronoun consistency, formal vs informal writing analysis",
    outcomes: "Students demonstrate pronoun-antecedent agreement in writing",
    assessments: "Pronoun quiz, writing sample review",
    linkedConcept: "Pronouns",
    linkedTopic: "Personal Pronouns",
  },
  {
    id: "3",
    week: 3,
    focus: "Syllables and Word Structure",
    activities: "Syllable clapping exercises, multisyllabic word decoding, vocabulary building",
    outcomes: "Students apply syllable division rules independently",
    assessments: "Word structure worksheet, oral reading check",
  },
  {
    id: "4",
    week: 4,
    focus: "Sentence Formation",
    activities: "Sentence diagramming introduction, compound and complex sentence construction, mentor text analysis",
    outcomes: "Students construct grammatically correct sentences of varying types",
    assessments: "Sentence construction portfolio due, grammar assessment",
    linkedConcept: "Sentence Structure",
  },
];

// Initialize reports for each week
const initializeReports = (weeks: WeekData[]): WeekReport[] => {
  return weeks.map((week) => ({
    weekId: week.id,
    activitiesCompleted: false,
    assessmentsCompleted: false,
    notes: "",
  }));
};

export const WeeklyReportDialog = ({
  open,
  onOpenChange,
  className,
  subjectName,
}: WeeklyReportDialogProps) => {
  const [weeklyPlans] = useState<WeekData[]>(mockWeeklyPlans);
  const [reports, setReports] = useState<WeekReport[]>(() => initializeReports(mockWeeklyPlans));
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const currentWeek = weeklyPlans[currentWeekIndex];
  const currentReport = reports.find((r) => r.weekId === currentWeek?.id);

  const handleToggleActivity = () => {
    setReports((prev) =>
      prev.map((report) =>
        report.weekId === currentWeek.id
          ? { ...report, activitiesCompleted: !report.activitiesCompleted }
          : report
      )
    );
  };

  const handleToggleAssessment = () => {
    setReports((prev) =>
      prev.map((report) =>
        report.weekId === currentWeek.id
          ? { ...report, assessmentsCompleted: !report.assessmentsCompleted }
          : report
      )
    );
  };

  const handleUpdateNotes = (notes: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.weekId === currentWeek.id ? { ...report, notes } : report
      )
    );
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weeklyPlans.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const getWeekProgress = (weekId: string) => {
    const report = reports.find((r) => r.weekId === weekId);
    if (!report) return 0;
    const completed = [report.activitiesCompleted, report.assessmentsCompleted].filter(Boolean).length;
    return Math.round((completed / 2) * 100);
  };

  const getOverallProgress = () => {
    const totalTasks = weeklyPlans.length * 2;
    const completedTasks = reports.reduce((acc, report) => {
      return acc + [report.activitiesCompleted, report.assessmentsCompleted].filter(Boolean).length;
    }, 0);
    return Math.round((completedTasks / totalTasks) * 100);
  };

  if (!currentWeek || !currentReport) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            Weekly Progress Report
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {className} • {subjectName}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Overall Progress */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {getOverallProgress()}% complete
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${getOverallProgress()}%` }}
              />
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousWeek}
              disabled={currentWeekIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {weeklyPlans.map((week, index) => (
                <button
                  key={week.id}
                  onClick={() => setCurrentWeekIndex(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    index === currentWeekIndex
                      ? "bg-primary text-primary-foreground"
                      : getWeekProgress(week.id) === 100
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : getWeekProgress(week.id) > 0
                      ? "bg-muted text-foreground border border-border"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {week.week}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              disabled={currentWeekIndex === weeklyPlans.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Current Week Details */}
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {/* Week Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Week {currentWeek.week}: {currentWeek.focus}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {currentWeek.linkedConcept && (
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {currentWeek.linkedConcept}
                    </Badge>
                  )}
                  {currentWeek.linkedTopic && (
                    <Badge variant="outline" className="text-xs">
                      {currentWeek.linkedTopic}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Outcomes - Display Only (not a task) */}
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Learning Outcomes (Reference)
                      </p>
                      <p className="text-sm text-foreground">
                        {currentWeek.outcomes || "No outcomes defined"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activities - Checkable Task */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="activities"
                      checked={currentReport.activitiesCompleted}
                      onCheckedChange={handleToggleActivity}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="activities"
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className={`text-sm font-medium ${
                            currentReport.activitiesCompleted
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}>
                            Activities
                          </span>
                        </div>
                        <p className={`text-sm ${
                          currentReport.activitiesCompleted
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}>
                          {currentWeek.activities || "No activities defined"}
                        </p>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessments - Checkable Task */}
              {currentWeek.assessments && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="assessments"
                        checked={currentReport.assessmentsCompleted}
                        onCheckedChange={handleToggleAssessment}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="assessments"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                            <span className={`text-sm font-medium ${
                              currentReport.assessmentsCompleted
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}>
                              Assessment
                            </span>
                          </div>
                          <p className={`text-sm ${
                            currentReport.assessmentsCompleted
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}>
                            {currentWeek.assessments}
                          </p>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Optional Notes */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Notes (Optional)
                      </p>
                      <Textarea
                        value={currentReport.notes}
                        onChange={(e) => handleUpdateNotes(e.target.value)}
                        placeholder="Add any observations, adjustments, or comments about this week..."
                        className="min-h-[80px] text-sm resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Week Progress */}
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-muted-foreground">Week Progress</span>
                <span className="font-medium">
                  {getWeekProgress(currentWeek.id)}% complete
                </span>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
