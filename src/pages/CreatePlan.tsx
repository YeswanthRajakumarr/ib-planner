import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/layout/AppHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { savePlanMetadata } from "@/lib/demoStorage";
import { classesData } from "@/data/mockData";

const CreatePlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const classId = searchParams.get("class") || "";
  const subjectId = searchParams.get("subject") || "";

  // Find the class and subject info from the URL params
  const selectedClassInfo = classesData.find(c => c.id === classId);
  const selectedSubjectInfo = selectedClassInfo?.subjects.find(s => s.id === subjectId);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleContinue = () => {
    setValidationError(null);

    if (!startDate || !endDate) {
      setValidationError("Please select both start and end dates");
      return;
    }
    if (startDate >= endDate) {
      setValidationError("End date must be after start date");
      return;
    }

    savePlanMetadata(classId, subjectId, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    navigate(`/planner?class=${classId}&subject=${subjectId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-4 py-1.5">
            Step 1: Onboarding
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4 font-heading">Set Your Academic Horizon</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Define the boundaries of your teaching unit. We'll use this to structure your monthly workflows and AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-3 rounded-[48px] border-border/50 shadow-2xl shadow-primary/5 overflow-hidden bg-card animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
            <CardHeader className="bg-muted/50 p-10 border-b border-border/30">
              <CardTitle className="text-2xl font-bold tracking-tight">Plan Configuration</CardTitle>
              <CardDescription className="text-base">
                Timeline selection for {selectedSubjectInfo?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              {validationError && (
                <Alert variant="destructive" className="rounded-3xl bg-destructive/5 border-destructive/20 text-destructive animate-in shake duration-500">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-semibold">{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 group hover:border-primary/20 transition-all">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Assigned Class</Label>
                  <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {selectedClassInfo ? `${selectedClassInfo.name}` : "Unknown Class"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{selectedClassInfo?.grade || "N/A"}</p>
                </div>
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 group hover:border-primary/20 transition-all">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Academic Subject</Label>
                  <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {selectedSubjectInfo?.name || "Unknown Subject"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Standard Level</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Teaching Period</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="start-date" className="text-xs font-bold text-muted-foreground uppercase tracking-tight ml-1">Commencement</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant="outline"
                          className={cn(
                            "h-14 w-full justify-start text-left font-semibold rounded-2xl bg-muted/20 border-border/50 hover:bg-muted/30 hover:border-primary/30 transition-all",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-50" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl border-border/50 shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="pointer-events-auto p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="end-date" className="text-xs font-bold text-muted-foreground uppercase tracking-tight ml-1">Conclusion</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="end-date"
                          variant="outline"
                          className={cn(
                            "h-14 w-full justify-start text-left font-semibold rounded-2xl bg-muted/20 border-border/50 hover:bg-muted/30 hover:border-primary/30 transition-all",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-50" />
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl border-border/50 shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                          className="pointer-events-auto p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button onClick={handleContinue} className="w-full h-16 rounded-[24px] text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Initialize Planning Workspace
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
            <div className="p-8 rounded-[40px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                Planning Guide
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">1</div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">Your timeline determines the number of <span className="text-primary font-bold">Monthly Milestones</span> we'll generate.</p>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">2</div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">AI suggestions will automatically align with the <span className="text-primary font-bold">seasonal curriculum requirements</span> of your region.</p>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">3</div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">You can <span className="text-primary font-bold">adjust these dates later</span>, but the scope of work will remain locked to this period.</p>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-[40px] bg-muted/20 border border-border/50 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Secured by</p>
              <div className="flex items-center justify-center gap-6 grayscale opacity-40">
                <div className="h-6 w-24 bg-muted-foreground/30 rounded" />
                <div className="h-6 w-20 bg-muted-foreground/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePlan;
