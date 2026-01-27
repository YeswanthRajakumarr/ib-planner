import { ClassData } from "@/data/mockData";

const AUTH_KEY = "ib_planner_authenticated";

// Auth State
export const isAuthenticated = (): boolean => {
    return localStorage.getItem(AUTH_KEY) === "true";
};

export const setAuthenticated = (status: boolean) => {
    localStorage.setItem(AUTH_KEY, status.toString());
};

export const login = async (email: string) => {
    const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email })
    });
    if (res.ok) {
        setAuthenticated(true);
        return true;
    }
    return false;
};

// Classes & Subjects State
export const fetchClasses = async (): Promise<ClassData[]> => {
    try {
        const res = await fetch("/api/classes");
        if (!res.ok) throw new Error("Failed to fetch classes");
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateSubjectStatus = async (classId: string, subjectId: string, status: "draft" | "published", completion: number) => {
   await fetch(`/api/classes/${classId}/subjects/${subjectId}`, {
       method: "PATCH",
       body: JSON.stringify({ planStatus: status, completionPercentage: completion, hasActivePlan: true })
   });
};

// Planning Data
export const fetchPlanningData = async (subjectId: string, month: string) => {
    try {
        const res = await fetch(`/api/planning/${subjectId}/${month}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const savePlanningData = async (subjectId: string, month: string, section: string | null, content: any) => {
    await fetch(`/api/planning/${subjectId}/${month}`, {
        method: "POST",
        body: JSON.stringify(section ? { section, content } : content)
    });
};

// Plan Metadata & Progress
export const fetchMonthsCompleted = async (subjectId: string): Promise<number[]> => {
    try {
        const res = await fetch(`/api/planning/${subjectId}/progress`);
        if (!res.ok) return [];
        const data = await res.json();
        // createServer returns array directly in our implementation? 
        // Let's check server.ts: returns completions.models.map(...) which is an array.
        // But mirage usually wraps lists ?? No, my custom route returned array directly.
        // Wait, usually mirage returns { items: [...] } or checks serializer.
        // My server implementation: return completions.models.map(c => c.monthIndex); -> returns array [0, 1]
        // Mirage auto-response wrapper? No, if I return array/object it sends as JSON.
        return data; 
    } catch (e) {
        return [];
    }
};

export const saveMonthCompleted = async (subjectId: string, monthIndex: number) => {
    await fetch(`/api/planning/${subjectId}/progress`, {
        method: "POST",
        body: JSON.stringify({ monthIndex })
    });
};

// Helper for UI
export const getFullPlanningProgress = async (subjectId: string, monthNames: string[]) => {
    const completed = await fetchMonthsCompleted(subjectId);
    
    // We can't easily get fine-grained data for all months without N requests, 
    // so for the progress view we might just approximate or fetch all sequentially.
    // For demo purpose, let's just fetch existence.

    // To prevent N requests, maybe we just use the completed list for status
    return monthNames.map((month, index) => ({
        month,
        status: completed.includes(index) ? "completed" : "planned",
        conceptsCovered: 0, // Would need detailed stats API
        totalConcepts: 3, 
        topicsCovered: 0,
        totalTopics: 6,
        assessmentsCompleted: 0,
        totalAssessments: 3,
    }));
};

