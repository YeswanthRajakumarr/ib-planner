import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Save, Send, Layout, Target, Zap, BarChart, Calendar as CalendarIcon, Info, Sparkles, Command } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ConceptsSection } from "@/components/planner/ConceptsSection";
import { ProcessSection } from "@/components/planner/ProcessSection";
import { OutcomesSection } from "@/components/planner/OutcomesSection";
import { AssessmentSection } from "@/components/planner/AssessmentSection";
import { WeeklyPlanSection } from "@/components/planner/WeeklyPlanSection";
import { toast } from "@/hooks/use-toast";
import { updateSubjectStatus, getClasses, getMonthsCompleted, saveMonthCompleted } from "@/lib/demoStorage";
import { theme } from "@/lib/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const months = [
  "June 2024", "July 2024", "August 2024", "September 2024", "October 2024",
  "November 2024", "December 2024", "January 2025", "February 2025"
];

const MonthlyPlanner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("class") || "";
  const subjectId = searchParams.get("subject") || "";

  const classes = getClasses();
  const selectedClass = classes.find(c => c.id === classId);
  const selectedSubject = selectedClass?.subjects.find(s => s.id === subjectId);

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [planStatus, setPlanStatus] = useState<"draft" | "published">(selectedSubject?.planStatus || "draft");
  const [monthsCompleted, setMonthsCompleted] = useState<number[]>(() =>
    subjectId ? getMonthsCompleted(subjectId) : []
  );

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handleSaveDraft = () => {
    if (subjectId) {
      const isNew = !monthsCompleted.includes(currentMonthIndex);
      const currentCompleted = isNew ? [...monthsCompleted, currentMonthIndex] : monthsCompleted;
      const completion = Math.round((currentCompleted.length / months.length) * 100);

      updateSubjectStatus(subjectId, "draft", completion);
      saveMonthCompleted(subjectId, currentMonthIndex);
      if (isNew) setMonthsCompleted(currentCompleted);
    }
    toast({
      title: "Draft Saved",
      description: `${months[currentMonthIndex]} plan has been saved as draft.`,
    });
  };

  const handlePublish = () => {
    if (monthsCompleted.length < months.length) {
      // For demo purposes, we can allow partial publish but warn
      toast({
        title: "Experimental Publish",
        description: "Usually all months are required, but publishing for demo.",
      });
    }

    if (subjectId) {
      updateSubjectStatus(subjectId, "published", 100);
    }

    setPlanStatus("published");
    toast({
      title: "Plan Published",
      description: "Your academic plan has been published successfully.",
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save draft
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
      // Ctrl/Cmd + Shift + P to publish
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "p") {
        e.preventDefault();
        handlePublish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [monthsCompleted, currentMonthIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      {/* Workspace Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-6 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/classes")} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {selectedSubject?.name || 'Unit Planner'}
                </h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase">
                  {selectedClass?.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                IB MYP Framework • Academic Year 2024-25
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-2xl border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              disabled={currentMonthIndex === 0}
              className="rounded-xl h-9 w-9"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 px-4 min-w-[160px] justify-center">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {months[currentMonthIndex]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              disabled={currentMonthIndex === months.length - 1}
              className="rounded-xl h-9 w-9"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Overall Progress</span>
              <span className="text-sm font-bold text-primary">{Math.round((monthsCompleted.length / months.length) * 100)}%</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleSaveDraft} className="rounded-full shadow-sm group transition-all hover:shadow-md hover:border-primary/30">
                  <Save className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Save Draft
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-2">
                <span>Save Draft</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border">⌘S</kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handlePublish} className="rounded-full shadow-md shadow-primary/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
                  <Send className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-2">
                <span>Publish Plan</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border">⌘⇧P</kbd>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Progress At-a-Glance Strip */}
      <div className="border-b border-border/20 bg-gradient-to-r from-primary/[0.02] to-transparent px-6 py-3 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">This Month:</span>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-foreground">3 Concepts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-foreground">10 Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-foreground">3 Outcomes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-foreground">2 Assessments</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              {monthsCompleted.includes(currentMonthIndex) ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 font-bold">Saved</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-600 font-bold">Unsaved</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden max-w-7xl mx-auto w-full">
        <Tabs defaultValue="concepts" className="flex w-full overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-64 border-r border-border/50 bg-muted/10 hidden md:flex flex-col py-6 px-4">
            <div className="mb-6 px-2">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Planning Sections</h3>
              <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0">
                <TabsTrigger value="concepts" className="w-full justify-start gap-3 h-11 px-4 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none shadow-none text-muted-foreground hover:bg-primary/5 transition-colors">
                  <Layout className="w-4 h-4" />
                  <span className="font-semibold text-sm">Concepts</span>
                </TabsTrigger>
                <TabsTrigger value="process" className="w-full justify-start gap-3 h-11 px-4 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none shadow-none text-muted-foreground hover:bg-primary/5 transition-colors">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold text-sm">Process</span>
                </TabsTrigger>
                <TabsTrigger value="outcomes" className="w-full justify-start gap-3 h-11 px-4 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none shadow-none text-muted-foreground hover:bg-primary/5 transition-colors">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold text-sm">Outcomes</span>
                </TabsTrigger>
                <TabsTrigger value="assessment" className="w-full justify-start gap-3 h-11 px-4 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none shadow-none text-muted-foreground hover:bg-primary/5 transition-colors">
                  <BarChart className="w-4 h-4" />
                  <span className="font-semibold text-sm">Assessment</span>
                </TabsTrigger>
                <TabsTrigger value="weekly" className="w-full justify-start gap-3 h-11 px-4 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none shadow-none text-muted-foreground hover:bg-primary/5 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-semibold text-sm">Weekly Plan</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <Separator className="mb-6 opacity-50" />

            <div className="mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase">AI Copilot</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Stuck on your ATL skills or Inquiry questions? Use our AI suggestions in each section to jumpstart your planning.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow px-6 py-8">
              <div className="max-w-4xl mx-auto w-full">
                <TabsContent value="concepts" className="m-0 focus-visible:ring-0">
                  <ConceptsSection
                    month={months[currentMonthIndex]}
                    subjectId={subjectId}
                    key={`${subjectId}-${months[currentMonthIndex]}-concepts`}
                  />
                </TabsContent>

                <TabsContent value="process" className="m-0 focus-visible:ring-0">
                  <ProcessSection
                    month={months[currentMonthIndex]}
                    subjectId={subjectId}
                    key={`${subjectId}-${months[currentMonthIndex]}-process`}
                  />
                </TabsContent>

                <TabsContent value="outcomes" className="m-0 focus-visible:ring-0">
                  <OutcomesSection
                    month={months[currentMonthIndex]}
                    subjectId={subjectId}
                    key={`${subjectId}-${months[currentMonthIndex]}-outcomes`}
                  />
                </TabsContent>

                <TabsContent value="assessment" className="m-0 focus-visible:ring-0">
                  <AssessmentSection
                    month={months[currentMonthIndex]}
                    subjectId={subjectId}
                    key={`${subjectId}-${months[currentMonthIndex]}-assessment`}
                  />
                </TabsContent>

                <TabsContent value="weekly" className="m-0 focus-visible:ring-0">
                  <WeeklyPlanSection
                    month={months[currentMonthIndex]}
                    subjectId={subjectId}
                    key={`${subjectId}-${months[currentMonthIndex]}-weekly`}
                  />
                </TabsContent>
              </div>
            </ScrollArea>

            {/* Contextual help footer */}
            <footer className="border-t border-border/50 bg-muted/5 p-4 flex items-center gap-4 text-muted-foreground">
              <Info className="w-4 h-4" />
              <p className="text-[11px] font-medium leading-none">Changes are automatically saved as you plan. Publish once all months are complete.</p>
            </footer>
          </main>
        </Tabs>
      </div>
    </div>
  );
};

export default MonthlyPlanner;
