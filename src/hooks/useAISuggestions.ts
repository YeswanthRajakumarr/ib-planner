import { useState } from "react";
import { toast } from "sonner";

interface UseAISuggestionsOptions {
  type: 'outcomes' | 'process' | 'assessments';
  month: string;
  concepts?: string[];
  topics?: string[];
  existingItems?: string[];
}

interface AssessmentSuggestion {
  title: string;
  description: string;
  category: "grammar" | "writing" | "reading";
}

const MOCK_SUGGESTIONS = {
  outcomes: [
    "Students will demonstrate understanding of the core concepts through practical application.",
    "Analyze key themes and connect them to real-world scenarios.",
    "Develop critical thinking skills by evaluating multiple perspectives.",
    "Synthesize information to create original work demonstrating mastery.",
    "Collaborate effectively to solve complex problems related to the unit."
  ],
  assessments: [
    {
      title: "Creative Writing Portfolio",
      description: "A collection of creative writing pieces exploring different genres and styles tailored to the unit's theme.",
      category: "writing"
    },
    {
      title: "Grammar Proficiency Test",
      description: "A comprehensive test assessing understanding of sentence structure, punctuation, and usage.",
      category: "grammar"
    },
    {
      title: "Reading Comprehension Analysis",
      description: "An in-depth analysis of a selected text, focusing on literary devices and thematic elements.",
      category: "reading"
    }
  ] as AssessmentSuggestion[],
  process: [
    "Interactive group discussions to brainstorm ideas and share diverse viewpoints.",
    "Hands-on workshop focusing on practical skills and application of concepts.",
    "Peer review sessions to provide constructive feedback on draft work.",
    "Guided inquiry stations exploring different aspects of the topic.",
    "Reflection journaling to consolidate learning and identify areas for growth."
  ]
};


export function useAISuggestions<T>() {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async (options: UseAISuggestionsOptions) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options)
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await res.json();
      setSuggestions((data.suggestions || []) as T[]);
      toast.success("Suggestions generated successfully!");

    } catch (err) {
      console.error('Error generating suggestions:', err);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    isLoading,
    generateSuggestions,
    clearSuggestions,
  };
}

