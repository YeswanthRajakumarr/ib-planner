import { useState, useEffect } from "react";
// ... existing imports ...
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, ClipboardList, Link, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

import { getPlanningData, savePlanningData } from "@/lib/demoStorage";

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

const availableConcepts = [
  { name: "Nouns", topics: ["Common Nouns", "Proper Nouns", "Abstract Nouns"] },
  { name: "Pronouns", topics: ["Personal Pronouns", "Possessive Pronouns", "Reflexive Pronouns"] },
  { name: "Sentence Structure", topics: ["Simple Sentences", "Compound Sentences", "Complex Sentences"] },
  { name: "Information Reports", topics: ["Structure", "Language Features", "Research Skills"] },
];

const englishWeeks: WeekData[] = [
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
];

interface WeeklyPlanSectionProps {
  month: string;
  subjectId?: string;
}

export const WeeklyPlanSection = ({ month, subjectId }: WeeklyPlanSectionProps) => {
  const [weeks, setWeeks] = useState<WeekData[]>(() => {
    const saved = getPlanningData(subjectId || 'default', month);
    if (saved && saved.weeklyPlan) {
      return saved.weeklyPlan;
    }

    if (subjectId && ['1a', '2a', '3a'].includes(subjectId)) {
      return JSON.parse(JSON.stringify(englishWeeks));
    }
    return [];
  });

  useEffect(() => {
    if (subjectId) {
      savePlanningData(subjectId, month, "weeklyPlan", weeks);
    }
  }, [weeks, month, subjectId]);

  // ... existing handler functions ...
  const handleUpdateWeek = (weekId: string, field: keyof WeekData, value: string) => {
    setWeeks(weeks.map(week =>
      week.id === weekId ? { ...week, [field]: value } : week
    ));
  };

  const handleUpdateLink = (weekId: string, concept?: string, topic?: string) => {
    setWeeks(weeks.map(week =>
      week.id === weekId
        ? { ...week, linkedConcept: concept, linkedTopic: concept ? topic : undefined }
        : week
    ));
  };

  const handleAddWeek = () => {
    const newWeekNumber = weeks.length + 1;
    const newWeek: WeekData = {
      id: Date.now().toString(),
      week: newWeekNumber,
      focus: "",
      activities: "",
      outcomes: "",
      assessments: "",
    };
    setWeeks([...weeks, newWeek]);
  };

  const handleDeleteWeek = (weekId: string) => {
    const updatedWeeks = weeks.filter(w => w.id !== weekId);
    // Renumber weeks
    const renumberedWeeks = updatedWeeks.map((week, index) => ({
      ...week,
      week: index + 1
    }));
    setWeeks(renumberedWeeks);
  };

  const handleMoveWeek = (weekId: string, direction: 'up' | 'down') => {
    const index = weeks.findIndex(w => w.id === weekId);
    if (direction === 'up' && index > 0) {
      const newWeeks = [...weeks];
      [newWeeks[index - 1], newWeeks[index]] = [newWeeks[index], newWeeks[index - 1]];
      // Renumber
      setWeeks(newWeeks.map((week, i) => ({ ...week, week: i + 1 })));
    } else if (direction === 'down' && index < weeks.length - 1) {
      const newWeeks = [...weeks];
      [newWeeks[index], newWeeks[index + 1]] = [newWeeks[index + 1], newWeeks[index]];
      // Renumber
      setWeeks(newWeeks.map((week, i) => ({ ...week, week: i + 1 })));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Weekly Breakdown</h2>
          <p className="text-sm text-muted-foreground">
            Operationalize your unit with a week-by-week delivery schedule for {month}.
          </p>
        </div>
        <Button onClick={handleAddWeek} className="rounded-full h-11 px-8 shadow-md shadow-primary/20 text-xs font-bold uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-2" />
          Add Teaching Week
        </Button>
      </div>

      <div className="space-y-12 relative before:absolute before:left-6 md:before:left-10 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/5 before:to-transparent">
        {weeks.length === 0 ? (
          <div className="py-20 text-center rounded-[40px] border-2 border-dashed border-border/50 bg-muted/20 ml-12">
            <Calendar className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
            <p className="text-sm font-semibold text-muted-foreground">No weeks mapped out yet. Start building your schedule.</p>
          </div>
        ) : (
          weeks.map((week, index) => (
            <div key={week.id} className="relative pl-12 md:pl-20 group">
              {/* Timeline Indicator */}
              <div className="absolute left-0 top-0 flex flex-col items-center">
                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-3xl border-4 border-background flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${week.linkedConcept ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter opacity-70">Week</span>
                    <span className="text-lg md:text-2xl font-black">{week.week}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleMoveWeek(week.id, 'up')} disabled={index === 0}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleMoveWeek(week.id, 'down')} disabled={index === weeks.length - 1}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className={`rounded-[40px] border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 ${week.linkedConcept ? "bg-gradient-to-br from-primary/[0.03] to-transparent border-primary/20" : "bg-card"
                }`}>
                <CardHeader className="bg-muted/50 px-8 py-6 border-b border-border/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-2xl">
                      <Input
                        value={week.focus}
                        onChange={(e) => handleUpdateWeek(week.id, "focus", e.target.value)}
                        placeholder="Week's main objective or focal point..."
                        className="text-lg font-bold bg-transparent border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden lg:flex items-center gap-2">
                        <Link className="w-3 h-3 text-primary/60" />
                        <Select
                          value={week.linkedConcept || "none"}
                          onValueChange={(value) => handleUpdateLink(week.id, value === "none" ? undefined : value, undefined)}
                        >
                          <SelectTrigger className="h-8 rounded-full bg-background border-border/50 text-[10px] font-bold uppercase tracking-widest px-4 border-none shadow-none focus:ring-0 w-auto min-w-[140px]">
                            <SelectValue placeholder="Link Concept..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="none">UNLINKED</SelectItem>
                            {availableConcepts.map((concept) => (
                              <SelectItem key={concept.name} value={concept.name}>{concept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full" onClick={() => handleDeleteWeek(week.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Instructional Flow</h4>
                      </div>
                      <Textarea
                        value={week.activities}
                        onChange={(e) => handleUpdateWeek(week.id, "activities", e.target.value)}
                        placeholder="How will students engage?"
                        className="min-h-[140px] text-sm bg-muted/20 border-border/50 rounded-2xl p-4 resize-none leading-relaxed italic"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                          <Target className="w-4 h-4" />
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Competency Targets</h4>
                      </div>
                      <Textarea
                        value={week.outcomes}
                        onChange={(e) => handleUpdateWeek(week.id, "outcomes", e.target.value)}
                        placeholder="What will they master?"
                        className="min-h-[140px] text-sm bg-muted/20 border-border/50 rounded-2xl p-4 resize-none leading-relaxed italic"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Progress Checks</h4>
                      </div>
                      <Textarea
                        value={week.assessments}
                        onChange={(e) => handleUpdateWeek(week.id, "assessments", e.target.value)}
                        placeholder="How will success be seen?"
                        className="min-h-[140px] text-sm bg-muted/20 border-border/50 rounded-2xl p-4 resize-none leading-relaxed italic"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Summary Board */}
      <div className="mt-20 p-1 bg-muted/20 rounded-[48px] border border-border/50 shadow-inner">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <div className="bg-background rounded-[40px] p-8 text-center flex flex-col items-center justify-center border border-border/30">
            <span className="text-3xl font-black text-primary mb-1 tracking-tighter">{weeks.length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Weeks</span>
          </div>
          <div className="bg-background/50 rounded-[40px] p-8 text-center flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-foreground/70 mb-1 tracking-tighter">
              {weeks.filter(w => w.activities.trim()).length}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">W/ Activities</span>
          </div>
          <div className="bg-background/50 rounded-[40px] p-8 text-center flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-foreground/70 mb-1 tracking-tighter">
              {weeks.filter(w => w.outcomes.trim()).length}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">W/ Targets</span>
          </div>
          <div className="bg-primary/5 rounded-[40px] p-8 text-center flex flex-col items-center justify-center border border-primary/10">
            <span className="text-3xl font-black text-primary mb-1 tracking-tighter">
              {weeks.filter(w => w.linkedConcept).length}
            </span>
            <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Concept Match</span>
          </div>
        </div>
      </div>
    </div>
  );
};