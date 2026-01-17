import { useState, useEffect } from "react";
// ... existing imports ...
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles, X, Target, Loader2 } from "lucide-react";
import { useAISuggestions } from "@/hooks/useAISuggestions";

interface Outcome {
  id: string;
  content: string;
  isAiGenerated?: boolean;
}

import { getPlanningData, savePlanningData } from "@/lib/demoStorage";

interface Outcome {
  id: string;
  content: string;
  isAiGenerated?: boolean;
}

const englishOutcomes: Outcome[] = [
  {
    id: "1",
    content: "Students will be able to identify and correctly classify common and proper nouns in written text with 85% accuracy",
  },
];

interface OutcomesSectionProps {
  month: string;
  subjectId?: string;
}

export const OutcomesSection = ({ month, subjectId }: OutcomesSectionProps) => {
  const [outcomes, setOutcomes] = useState<Outcome[]>(() => {
    const saved = getPlanningData(subjectId || 'default', month);
    if (saved && saved.outcomes) {
      return saved.outcomes;
    }

    if (subjectId && ['1a', '2a', '3a'].includes(subjectId)) {
      return JSON.parse(JSON.stringify(englishOutcomes));
    }
    return [];
  });

  const [newOutcome, setNewOutcome] = useState("");
  const { suggestions, isLoading, generateSuggestions, clearSuggestions } = useAISuggestions<string>();

  useEffect(() => {
    if (subjectId) {
      savePlanningData(subjectId, month, "outcomes", outcomes);
    }
  }, [outcomes, month, subjectId]);

  // ... rest of existing functions ...
  const handleAddOutcome = () => {
    if (!newOutcome.trim()) return;
    setOutcomes([...outcomes, { id: Date.now().toString(), content: newOutcome }]);
    setNewOutcome("");
  };

  const handleRemoveOutcome = (outcomeId: string) => {
    setOutcomes(outcomes.filter(o => o.id !== outcomeId));
  };

  const handleAddAiOutcome = (content: string) => {
    setOutcomes([...outcomes, { id: Date.now().toString(), content, isAiGenerated: true }]);
  };

  const handleGenerateSuggestions = () => {
    generateSuggestions({
      type: 'outcomes',
      month,
      concepts: ['Grammar', 'Writing'],
      topics: ['Nouns and Pronouns', 'Syllables and Word Structure', 'Sentence Formation'],
      existingItems: outcomes.map(o => o.content),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Learning Outcomes</h2>
        <p className="text-sm text-muted-foreground">
          Define clear, measurable goals for student achievement in {month}.
        </p>
      </div>

      <div className="space-y-4">
        {outcomes.map((outcome) => (
          <Card
            key={outcome.id}
            className="group relative border-border/50 hover:border-primary/20 bg-card hover:bg-muted/30 transition-all duration-300 rounded-3xl overflow-hidden"
          >
            <CardContent className="p-5 flex gap-5">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 py-1">
                <p className="text-[15px] font-medium leading-relaxed text-foreground/90">
                  {outcome.content}
                </p>
                {outcome.isAiGenerated && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">AI Assisted</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full opacity-0 group-hover:opacity-100 transition-all self-center"
                onClick={() => handleRemoveOutcome(outcome.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {outcomes.length === 0 && (
          <div className="py-16 text-center rounded-3xl border-2 border-dashed border-border/50 bg-muted/20">
            <Target className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-medium">What should students be able to do by the end of {month}?</p>
          </div>
        )}
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl bg-muted/20">
        <CardContent className="p-0">
          <Textarea
            placeholder="e.g., Students will be able to synthesize complex arguments from multiple text sources..."
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
            className="min-h-[140px] bg-transparent border-none focus-visible:ring-0 p-8 text-base resize-none leading-relaxed"
          />
          <div className="px-8 pb-8 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleGenerateSuggestions}
              disabled={isLoading}
              className="rounded-full h-11 px-6 border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Generating..." : "AI Suggestions"}
            </Button>
            <Button
              onClick={handleAddOutcome}
              disabled={!newOutcome.trim()}
              className="rounded-full h-11 px-8 shadow-md shadow-primary/20 text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Outcome
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestion Carousel */}
      {suggestions.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Suggested Learning Outcomes</CardTitle>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-tight opacity-70">Based on IB pedagogical standards</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearSuggestions} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid gap-4">
            {suggestions.map((content, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-background rounded-2xl border border-border/50 hover:border-primary/40 transition-all group/suggestion shadow-sm"
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center group-hover/suggestion:bg-primary/10 transition-colors">
                  <Target className="w-3 h-3 text-muted-foreground group-hover/suggestion:text-primary transition-colors" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic flex-1">{content}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddAiOutcome(content)}
                  className="rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Adopt
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
