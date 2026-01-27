import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Link2, Layout } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

import { fetchPlanningData, savePlanningData } from "@/lib/demoStorage";

interface Topic {
  id: string;
  name: string;
}

interface Concept {
  id: string;
  name: string;
  topics: Topic[];
}

const englishConcepts: Concept[] = [
  {
    id: "1",
    name: "Grammar",
    topics: [
      { id: "1a", name: "Nouns and Pronouns" },
      { id: "1b", name: "Syllables and Word Structure" },
      { id: "1c", name: "Sentence Formation" },
    ],
  },
  {
    id: "2",
    name: "Writing",
    topics: [
      { id: "2a", name: "Information Report" },
      { id: "2b", name: "Narrative Structure" },
    ],
  },
];

interface ConceptsSectionProps {
  month: string;
  subjectId?: string;
}

export const ConceptsSection = ({ month, subjectId }: ConceptsSectionProps) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newConceptName, setNewConceptName] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!subjectId) return;
      const saved = await fetchPlanningData(subjectId, month);
      if (saved && saved.concepts) {
        setConcepts(saved.concepts);
      } else if (['1a', '2a', '3a'].includes(subjectId)) {
        setConcepts(JSON.parse(JSON.stringify(englishConcepts)));
      }
      setIsLoaded(true);
    };
    loadData();
  }, [subjectId, month]);

  // Save data when concepts change
  useEffect(() => {
    if (subjectId && isLoaded) {
      savePlanningData(subjectId, month, "concepts", concepts);
    }
  }, [concepts, month, subjectId, isLoaded]);

  const handleAddConcept = () => {
    if (!newConceptName.trim()) return;
    const newConcept: Concept = {
      id: Date.now().toString(),
      name: newConceptName,
      topics: [],
    };
    setConcepts([...concepts, newConcept]);
    setNewConceptName("");
  };

  const handleAddTopic = (conceptId: string) => {
    const topicName = newTopicInputs[conceptId];
    if (!topicName?.trim()) return;

    setConcepts(concepts.map(concept => {
      if (concept.id === conceptId) {
        return {
          ...concept,
          topics: [...concept.topics, { id: Date.now().toString(), name: topicName }],
        };
      }
      return concept;
    }));
    setNewTopicInputs({ ...newTopicInputs, [conceptId]: "" });
  };

  const handleRemoveTopic = (conceptId: string, topicId: string) => {
    setConcepts(concepts.map(concept => {
      if (concept.id === conceptId) {
        return {
          ...concept,
          topics: concept.topics.filter(t => t.id !== topicId),
        };
      }
      return concept;
    }));
  };

  const handleRemoveConcept = (conceptId: string) => {
    setConcepts(concepts.filter(c => c.id !== conceptId));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Concepts & Topics</h2>
        <p className="text-sm text-muted-foreground">
          Map out the fundamental ideas and specific subject matter for {month}.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Relationship Mapping Card */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/[0.03] to-transparent shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/70">Structural Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {concepts.length === 0 ? (
              <EmptyState type="concepts" onAction={() => document.getElementById("concept-input")?.focus()} />
            ) : (
              <div className="space-y-4">
                {concepts.map((concept) => (
                  <div key={concept.id} className="glass dark:glass-dark rounded-2xl p-4 transition-all hover:shadow-md border-border/50 animate-slide-in">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="font-bold text-foreground text-sm tracking-tight">{concept.name}</span>
                      </div>
                      <div className="flex-1 flex flex-wrap items-center gap-2">
                        {concept.topics.length > 0 ? (
                          concept.topics.map((topic) => (
                            <Badge key={topic.id} variant="secondary" className="bg-background/80 text-[10px] font-semibold border-border/50 px-3 py-1 rounded-full">
                              {topic.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No topics assigned yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <Card key={concept.id} className="border-border/50 shadow-sm hover:border-primary/20 transition-all flex flex-col group">
              <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <CardTitle className="text-base font-bold">{concept.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                  onClick={() => handleRemoveConcept(concept.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="flex flex-wrap gap-2">
                  {concept.topics.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant="outline"
                      className="pl-3 pr-1 py-1 rounded-full flex items-center gap-1 group/badge bg-muted/30 border-border/50"
                    >
                      <span className="text-[11px] font-medium">{topic.name}</span>
                      <button
                        onClick={() => handleRemoveTopic(concept.id, topic.id)}
                        className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <Input
                    placeholder="New topic..."
                    value={newTopicInputs[concept.id] || ""}
                    onChange={(e) => setNewTopicInputs({
                      ...newTopicInputs,
                      [concept.id]: e.target.value
                    })}
                    className="h-9 text-xs flex-1 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTopic(concept.id);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddTopic(concept.id)}
                    className="h-9 rounded-xl px-4"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Concept Trigger */}
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/[0.01] transition-all cursor-pointer group min-h-[160px]" onClick={() => document.getElementById("new-concept-input")?.focus()}>
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex gap-2 w-full max-w-[240px]">
              <Input
                id="new-concept-input"
                placeholder="Core Concept..."
                value={newConceptName}
                onChange={(e) => setNewConceptName(e.target.value)}
                className="h-9 text-xs flex-1 rounded-xl bg-background border-border/50"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddConcept();
                }}
              />
              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAddConcept(); }} className="h-9 rounded-xl px-4">
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

