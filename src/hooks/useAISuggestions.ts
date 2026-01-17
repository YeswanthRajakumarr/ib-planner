import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseAISuggestionsOptions {
  type: 'outcomes' | 'process' | 'assessments';
  month: string;
  concepts?: string[];
  topics?: string[];
  existingItems?: string[];
}

export function useAISuggestions<T>() {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async (options: UseAISuggestionsOptions) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: options,
      });

      if (error) {
        console.error('Error calling AI:', error);
        toast.error('Failed to generate suggestions. Please try again.');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
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
