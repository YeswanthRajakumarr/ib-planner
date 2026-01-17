import { ClassData, Subject, classesData } from "@/data/mockData";

const STORAGE_KEY = "ib_planner_demo_data";
const PLANNING_DATA_KEY = "ib_planner_demo_planning";
const PLAN_METADATA_KEY = "ib_planner_demo_metadata";

// Classes & Subjects State
export const getClasses = (): ClassData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(classesData));
        return classesData;
    }

    // Merge: ensure new classes from mockData are included
    const cachedClasses: ClassData[] = JSON.parse(data);
    const cachedIds = new Set(cachedClasses.map(c => c.id));
    const newClasses = classesData.filter(c => !cachedIds.has(c.id));

    if (newClasses.length > 0) {
        const merged = [...cachedClasses, ...newClasses];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
    }

    return cachedClasses;
};

export const updateSubjectStatus = (subjectId: string, status: "draft" | "published", completion: number) => {
    const classes = getClasses();
    const updatedClasses = classes.map(c => ({
        ...c,
        subjects: c.subjects.map(s =>
            s.id === subjectId
                ? { ...s, planStatus: status, completionPercentage: completion, hasActivePlan: true }
                : s
        )
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClasses));
};

// Preset data mapping for high-fidelity demo (based on real school examples)
const PRESET_PLANNING_DATA: Record<string, any> = {
    "4a_June 2024": {
        concepts: [
            {
                id: "1",
                name: "Grammar: Nouns & Syllables",
                topics: [
                    { id: "1-1", name: "Proper Nouns" },
                    { id: "1-2", name: "Collective Nouns" },
                    { id: "1-3", name: "Abstract Nouns" },
                    { id: "1-4", name: "Open/Closed Syllables" }
                ]
            },
            {
                id: "2",
                name: "Writing: Informational Report",
                topics: [
                    { id: "2-1", name: "Graphic Organizers" },
                    { id: "2-2", name: "Drafting" },
                    { id: "2-3", name: "Editing & Reviewing" }
                ]
            },
            {
                id: "3",
                name: "Reading: Analyze Character",
                topics: [
                    { id: "3-1", name: "Plot Elements" },
                    { id: "3-2", name: "Character Motivation" },
                    { id: "3-3", name: "RAZ Plus Resources" }
                ]
            }
        ],
        outcomes: [
            { id: "o1", content: "Research information on various subjects and speak with confidence." },
            { id: "o2", content: "Identify and describe elements of a story - plot, setting, characters, and theme." },
            { id: "o3", content: "Understand syllables to spell and pronounce words correctly." }
        ],
        process: [
            { id: "p1", content: "Learners brainstorm noun types for topics like 'Forest' or 'Space' and present in class.", linkedTopic: "Proper Nouns" },
            { id: "p2", content: "Clapping activity to represent the number of syllables in each word.", linkedTopic: "Open/Closed Syllables" },
            { id: "p3", content: "Using graphic organizers to guide informational report drafting.", linkedTopic: "Graphic Organizers" }
        ],
        assessment: [
            { id: "a1", title: "Prior Knowledge Assessment", description: "Assessment of language skills and conceptual understanding of grammar components.", category: "grammar" },
            { id: "a2", title: "Informative Speech Presentation", description: "Presenting on a chosen topic with peer feedback.", category: "speaking" }
        ]
    },
    "4a_July 2024": {
        concepts: [
            {
                id: "c1",
                name: "Grammar: Pronouns & Sentences",
                topics: [
                    { id: "c1-1", name: "Personal Pronouns" },
                    { id: "c1-2", name: "Reflexive Pronouns" },
                    { id: "c1-3", name: "Types of Sentences" }
                ]
            },
            {
                id: "c2",
                name: "Writing: Friendly Letters",
                topics: [
                    { id: "c2-1", name: "Letter Structure" },
                    { id: "c2-2", name: "Composition" },
                    { id: "c2-3", name: "Punctuation" }
                ]
            }
        ],
        outcomes: [
            { id: "o1", content: "Identify form and function of pronouns and its types." },
            { id: "o2", content: "Compose a personal letter using identifying elements." }
        ],
        process: [
            { id: "p1", content: "Sorting pronouns from peer-shared stories using floral or family strategies.", linkedTopic: "Personal Pronouns" },
            { id: "p2", content: "Finding sentence types in newspapers and switching tones via punctuation.", linkedTopic: "Types of Sentences" }
        ],
        assessment: [
            { id: "a1", title: "Sentence & Pronoun Proficiency", description: "Applying understanding of nouns, pronouns, and sentence types.", category: "grammar" }
        ]
    }
};

// Planning Data (Content for each section)
export const getPlanningData = (subjectId: string, month: string) => {
    const key = `${PLANNING_DATA_KEY}_${subjectId}_${month}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    // Fallback to preset high-fidelity data
    const presetKey = `${subjectId}_${month}`;
    if (PRESET_PLANNING_DATA[presetKey]) {
        return PRESET_PLANNING_DATA[presetKey];
    }

    return null;
};

export const savePlanningData = (subjectId: string, month: string, section: string, content: any) => {
    const key = `${PLANNING_DATA_KEY}_${subjectId}_${month}`;
    const existing = localStorage.getItem(key);
    const data = existing ? JSON.parse(existing) : {};
    data[section] = content;
    localStorage.setItem(key, JSON.stringify(data));
};

// Plan Metadata (Start/End dates)
export const savePlanMetadata = (classId: string, subjectId: string, metadata: { startDate: string, endDate: string }) => {
    const key = `${PLAN_METADATA_KEY}_${classId}_${subjectId}`;
    localStorage.setItem(key, JSON.stringify(metadata));
};

export const getPlanMetadata = (classId: string, subjectId: string) => {
    const key = `${PLAN_METADATA_KEY}_${classId}_${subjectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const getMonthsCompleted = (subjectId: string): number[] => {
    const key = `months_completed_${subjectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const saveMonthCompleted = (subjectId: string, monthIndex: number) => {
    const key = `months_completed_${subjectId}`;
    const existing = getMonthsCompleted(subjectId);
    if (!existing.includes(monthIndex)) {
        const updated = [...existing, monthIndex];
        localStorage.setItem(key, JSON.stringify(updated));
    }
};

export const getFullPlanningProgress = (subjectId: string, monthNames: string[]) => {
    return monthNames.map((month, index) => {
        const data = getPlanningData(subjectId, month);
        const completed = getMonthsCompleted(subjectId);

        return {
            month,
            status: completed.includes(index) ? "completed" : (data ? "in_progress" : "planned"),
            conceptsCovered: data?.concepts?.length || 0,
            totalConcepts: 3, // Mock total for demo
            topicsCovered: data?.concepts?.reduce((acc: number, c: any) => acc + (c.topics?.length || 0), 0) || 0,
            totalTopics: 6, // Mock total for demo
            assessmentsCompleted: data?.assessment?.length || 0,
            totalAssessments: 3, // Mock total for demo
        };
    });
};
