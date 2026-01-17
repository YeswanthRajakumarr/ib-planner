import { useState, useEffect } from "react";
// ... existing imports ...
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, PenTool, BookOpen, X, Link, Sparkles, Loader2 } from "lucide-react";
import { useAISuggestions } from "@/hooks/useAISuggestions";

import { getPlanningData, savePlanningData } from "@/lib/demoStorage";

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: "grammar" | "writing" | "reading" | "custom";
  linkedConcept?: string;
  linkedTopic?: string;
}

interface AISuggestion {
  title: string;
  description: string;
  category: "grammar" | "writing" | "reading";
}

const availableConcepts = [
  { name: "Nouns", topics: ["Common Nouns", "Proper Nouns", "Abstract Nouns"] },
  { name: "Pronouns", topics: ["Personal Pronouns", "Possessive Pronouns", "Reflexive Pronouns"] },
  { name: "Sentence Structure", topics: ["Simple Sentences", "Compound Sentences", "Complex Sentences"] },
  { name: "Information Reports", topics: ["Structure", "Language Features", "Research Skills"] },
];

const englishAssessments: Assessment[] = [
  {
    id: "g1",
    title: "Noun Classification Quiz",
    description: "Identify and categorize nouns as common, proper, concrete, or abstract from given passages",
    category: "grammar",
  },
];

interface AssessmentSectionProps {
  month: string;
  subjectId?: string;
}

export const AssessmentSection = ({ month, subjectId }: AssessmentSectionProps) => {
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(() => {
    const saved = getPlanningData(subjectId || 'default', month);
    if (saved && saved.assessment) {
      return saved.assessment;
    }

    if (subjectId && ['1a', '2a', '3a'].includes(subjectId)) {
      return JSON.parse(JSON.stringify(englishAssessments));
    }
    return [];
  });

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customConcept, setCustomConcept] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const { suggestions, isLoading, generateSuggestions, clearSuggestions } = useAISuggestions<AISuggestion>();

  useEffect(() => {
    if (subjectId) {
      savePlanningData(subjectId, month, "assessment", selectedAssessments);
    }
  }, [selectedAssessments, month, subjectId]);

  // ... existing helper functions ...
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "grammar": return <FileText className="w-4 h-4" />;
      case "writing": return <PenTool className="w-4 h-4" />;
      case "reading": return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleAddAssessment = (assessment: Assessment | AISuggestion) => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      title: assessment.title,
      description: assessment.description,
      category: assessment.category,
    };
    setSelectedAssessments([...selectedAssessments, newAssessment]);
  };

  const handleRemoveAssessment = (assessmentId: string) => {
    setSelectedAssessments(selectedAssessments.filter(a => a.id !== assessmentId));
  };

  const handleAddCustom = () => {
    if (!customTitle.trim() || !customDescription.trim()) return;
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      title: customTitle,
      description: customDescription,
      category: "custom",
      linkedConcept: customConcept || undefined,
      linkedTopic: customConcept && customTopic ? customTopic : undefined,
    };
    setSelectedAssessments([...selectedAssessments, newAssessment]);
    setCustomTitle("");
    setCustomDescription("");
    setCustomConcept("");
    setCustomTopic("");
    setShowCustomForm(false);
  };

  const handleGenerateSuggestions = () => {
    generateSuggestions({
      type: 'assessments',
      month,
      concepts: availableConcepts.map(c => c.name),
      topics: availableConcepts.flatMap(c => c.topics),
      existingItems: selectedAssessments.map(a => a.title),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Assessment Strategy</h2>
        <p className="text-sm text-muted-foreground">
          Design formative and summative evaluations for {month}.
        </p>
      </div>

      <div className="grid gap-6">
        {selectedAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="group relative flex flex-col md:flex-row gap-6 p-6 bg-card hover:bg-muted/30 rounded-[32px] border border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-primary/5 rounded-[24px] group-hover:bg-primary/10 transition-colors">
              <div className="text-primary">
                {getCategoryIcon(assessment.category)}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold tracking-tight text-foreground">{assessment.title}</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {getCategoryLabel(assessment.category)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {assessment.description}
              </p>

              {(assessment.linkedConcept || assessment.linkedTopic) && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/30">
                  <Link className="w-3 h-3 text-muted-foreground/50" />
                  {assessment.linkedConcept && (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter bg-muted/30 border-border/50 rounded-full px-3">
                      {assessment.linkedConcept}
                    </Badge>
                  )}
                  {assessment.linkedTopic && (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter bg-muted/30 border-border/50 rounded-full px-3 border-dashed">
                      {assessment.linkedTopic}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full md:self-start opacity-0 group-hover:opacity-100 transition-all"
              onClick={() => handleRemoveAssessment(assessment.id)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ))}

        {selectedAssessments.length === 0 && (
          <div className="py-20 text-center rounded-[40px] border-2 border-dashed border-border/50 bg-muted/20">
            <BookOpen className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
            <p className="text-sm font-semibold text-muted-foreground">Define how you will measure student understanding for {month}.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Form or AI Assist */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {!showCustomForm ? (
            <div className="p-8 rounded-[40px] border-2 border-dashed border-border/50 hover:bg-primary/[0.02] hover:border-primary/20 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px]" onClick={() => setShowCustomForm(true)}>
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Custom Design</span>
            </div>
          ) : (
            <Card className="rounded-[40px] border-border/50 shadow-lg overflow-hidden animate-in zoom-in-95">
              <CardHeader className="bg-muted/50 pb-6">
                <CardTitle className="text-base font-bold">New Assessment</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input
                  placeholder="Title..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="h-11 rounded-2xl bg-muted/30 border-border/50"
                />
                <Textarea
                  placeholder="Instructions..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="min-h-[120px] rounded-2xl bg-muted/30 border-border/50 resize-none p-4"
                />
                <div className="grid grid-cols-1 gap-3">
                  <Select
                    value={customConcept || "none"}
                    onValueChange={(value) => {
                      setCustomConcept(value === "none" ? "" : value);
                      setCustomTopic("");
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-2xl bg-muted/30 border-border/50">
                      <SelectValue placeholder="Link Concept..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="none">No concept</SelectItem>
                      {availableConcepts.map((concept) => (
                        <SelectItem key={concept.name} value={concept.name}>
                          {concept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {customConcept && (
                    <Select
                      value={customTopic || "none"}
                      onValueChange={(value) => setCustomTopic(value === "none" ? "" : value)}
                    >
                      <SelectTrigger className="h-11 rounded-2xl bg-muted/30 border-border/50">
                        <SelectValue placeholder="Link Topic..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="none">No topic</SelectItem>
                        {availableConcepts
                          .find(c => c.name === customConcept)
                          ?.topics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <Button onClick={handleAddCustom} disabled={!customTitle.trim() || !customDescription.trim()} className="h-12 rounded-2xl font-bold">
                    Create Assessment
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCustomForm(false)} className="rounded-2xl">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="h-16 rounded-[32px] border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-3" />
            )}
            {isLoading ? "Thinking..." : "AI Idea Generator"}
          </Button>
        </div>

        {/* AI Suggestions Box */}
        <div className="lg:col-span-2">
          {suggestions.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/70">Pedagogical Recommendations</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={clearSuggestions} className="rounded-full h-8 px-4 text-muted-foreground">Clear All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/[0.02] to-transparent hover:border-primary/40 transition-all flex flex-col">
                    <CardHeader className="pb-3 flex-row items-center gap-3 space-y-0">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        {getCategoryIcon(suggestion.category)}
                      </div>
                      <CardTitle className="text-sm font-bold tracking-tight">{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pt-0 pb-4">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">"{suggestion.description}"</p>
                    </CardContent>
                    <div className="p-4 pt-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddAssessment(suggestion)}
                        className="w-full rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10"
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        Add to Plan
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-12 rounded-[40px] bg-muted/10 border border-border/50 text-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/20 mb-6" />
              <p className="text-sm text-muted-foreground max-w-[280px]">Need inspiration? Use the AI generator to see assessment ideas aligned with IB standards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
