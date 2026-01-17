import { useState, useEffect } from "react";
// ... existing imports ...
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Sparkles, Check, X, Link, Loader2, Layout } from "lucide-react";
import { useAISuggestions } from "@/hooks/useAISuggestions";

import { getPlanningData, savePlanningData } from "@/lib/demoStorage";

const availableTopics = [
  "Nouns and Pronouns",
  "Syllables and Word Structure",
  "Sentence Formation",
  "Information Report Writing",
  "Reading Comprehension",
  "Narrative Structure"
];

interface ProcessStep {
  id: string;
  content: string;
  linkedTopic?: string;
}

const englishSteps: ProcessStep[] = [
  {
    id: "1",
    content: "Introduce concept of nouns through visual categorization activity using classroom objects",
    linkedTopic: "Nouns and Pronouns",
  },
  {
    id: "2",
    content: "Students identify and classify nouns in provided text passages (individual work)",
    linkedTopic: "Nouns and Pronouns",
  },
];

interface ProcessSectionProps {
  month: string;
  subjectId?: string;
}

export const ProcessSection = ({ month, subjectId }: ProcessSectionProps) => {
  const [steps, setSteps] = useState<ProcessStep[]>(() => {
    const saved = getPlanningData(subjectId || 'default', month);
    if (saved && saved.process) {
      return saved.process;
    }

    if (subjectId && ['1a', '2a', '3a'].includes(subjectId)) {
      return JSON.parse(JSON.stringify(englishSteps));
    }
    return [];
  });

  const [newStep, setNewStep] = useState("");
  const [newStepTopic, setNewStepTopic] = useState<string>("");
  const { suggestions, isLoading, generateSuggestions, clearSuggestions } = useAISuggestions<string>();

  useEffect(() => {
    if (subjectId) {
      savePlanningData(subjectId, month, "process", steps);
    }
  }, [steps, month, subjectId]);

  // ... rest of the existing functions (handleAddStep, handleUpdateTopic, etc.) ...
  const handleAddStep = () => {
    if (!newStep.trim()) return;
    const actualTopic = newStepTopic === "none" ? undefined : newStepTopic;
    setSteps([...steps, {
      id: Date.now().toString(),
      content: newStep,
      linkedTopic: actualTopic || undefined
    }]);
    setNewStep("");
    setNewStepTopic("");
  };

  const handleUpdateTopic = (stepId: string, topic: string) => {
    const actualTopic = topic === "none" ? undefined : topic;
    setSteps(steps.map(s => s.id === stepId ? { ...s, linkedTopic: actualTopic } : s));
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleUpdateStep = (stepId: string, content: string) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, content } : s));
  };

  const handleAddSuggestion = (suggestion: string) => {
    setSteps([...steps, { id: Date.now().toString(), content: suggestion }]);
  };

  const handleGenerateSuggestions = () => {
    generateSuggestions({
      type: 'process',
      month,
      concepts: ['Grammar', 'Writing'],
      topics: availableTopics,
      existingItems: steps.map(s => s.content),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Teaching Process</h2>
        <p className="text-sm text-muted-foreground">
          Sequence your activities and pedagogical flow for {month}.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="group relative flex gap-4 p-5 bg-card hover:bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-2 pr-2 border-r border-border/30">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Step</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/30 hover:text-primary transition-colors mt-2">
                <GripVertical className="w-4 h-4 cursor-grab" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <Textarea
                value={step.content}
                onChange={(e) => handleUpdateStep(step.id, e.target.value)}
                className="min-h-[70px] bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-base leading-relaxed resize-none scrollbar-none"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="h-7 rounded-full bg-muted/50 border-border/50 flex items-center gap-2 px-3">
                  <Link className="w-3 h-3 text-muted-foreground" />
                  <Select
                    value={step.linkedTopic || "none"}
                    onValueChange={(value) => handleUpdateTopic(step.id, value)}
                  >
                    <SelectTrigger className="h-4 border-none shadow-none p-0 text-[11px] font-bold uppercase tracking-wider bg-transparent focus:ring-0 w-auto min-w-[100px]">
                      <SelectValue placeholder="Link Topic..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      <SelectItem value="none">UNLINKED</SelectItem>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic} value={topic} className="text-xs uppercase font-medium">
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              onClick={() => handleRemoveStep(step.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="py-16 text-center rounded-3xl border-2 border-dashed border-border/50 bg-muted/20">
            <Layout className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-medium">Outline your teaching steps to visualize the student journey.</p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl bg-muted/20">
        <CardContent className="p-0">
          <Textarea
            placeholder="Describe your next teaching activity..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 p-6 text-base resize-none"
          />
          <div className="px-6 pb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-9 rounded-full bg-background border-border/50 flex items-center gap-2 px-4">
                <Link className="w-3 h-3 text-muted-foreground" />
                <Select value={newStepTopic || "none"} onValueChange={(v) => setNewStepTopic(v === "none" ? "" : v)}>
                  <SelectTrigger className="h-4 border-none shadow-none p-0 text-[10px] font-bold uppercase tracking-widest bg-transparent focus:ring-0 w-auto min-w-[120px]">
                    <SelectValue placeholder="Link Topic..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="none">UNLINKED</SelectItem>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="text-[11px] uppercase font-medium">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleGenerateSuggestions}
                disabled={isLoading}
                className="rounded-full h-10 px-6 border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Thinking..." : "AI Assist"}
              </Button>
              <Button
                onClick={handleAddStep}
                disabled={!newStep.trim()}
                className="rounded-full h-10 px-8 shadow-md shadow-primary/20 text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Sidebar/Overlay style */}
      {suggestions.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Recommended Activities</CardTitle>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-tight opacity-70">Curated by AI Copilot</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearSuggestions} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group/suggestion flex flex-col gap-3 p-4 bg-background rounded-2xl border border-border/50 hover:border-primary/40 transition-all"
              >
                <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-3">"{suggestion}"</p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="w-full rounded-xl h-8 text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10"
                >
                  <Check className="w-3 h-3 mr-2" />
                  Include in Plan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
