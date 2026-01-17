export interface Subject {
  id: string;
  name: string;
  hasActivePlan?: boolean;
  planStatus?: "draft" | "published";
  completionPercentage?: number;
}

export interface ClassData {
  id: string;
  name: string;
  grade: string;
  studentCount?: number;
  subjects: Subject[];
}

export const classesData: ClassData[] = [
  {
    id: "1",
    name: "Class 7-A",
    grade: "Grade 7",
    studentCount: 28,
    subjects: [
      { id: "1a", name: "English Language & Literature", hasActivePlan: true, planStatus: "published", completionPercentage: 45 },
      { id: "1b", name: "Mathematics", hasActivePlan: true, planStatus: "draft", completionPercentage: 20 },
      { id: "1c", name: "Sciences", hasActivePlan: false },
      { id: "1d", name: "Individuals & Societies", hasActivePlan: false },
    ],
  },
  {
    id: "2",
    name: "Class 9-A",
    grade: "Grade 9",
    studentCount: 32,
    subjects: [
      { id: "2a", name: "English Language & Literature", hasActivePlan: true, planStatus: "published", completionPercentage: 65 },
      { id: "2b", name: "Mathematics", hasActivePlan: false },
      { id: "2c", name: "Sciences", hasActivePlan: true, planStatus: "draft", completionPercentage: 10 },
    ],
  },
  {
    id: "3",
    name: "Class 10-B",
    grade: "Grade 10",
    studentCount: 30,
    subjects: [
      { id: "3a", name: "English Language & Literature", hasActivePlan: false },
      { id: "3b", name: "Mathematics", hasActivePlan: true, planStatus: "published", completionPercentage: 80 },
      { id: "3c", name: "Sciences", hasActivePlan: true, planStatus: "published", completionPercentage: 55 },
      { id: "3d", name: "Design", hasActivePlan: false },
    ],
  },
  {
    id: "4",
    name: "Class 5-A",
    grade: "Grade 5",
    studentCount: 25,
    subjects: [
      { id: "4a", name: "English", hasActivePlan: true, planStatus: "published", completionPercentage: 100 },
      { id: "4b", name: "Mathematics", hasActivePlan: false },
      { id: "4c", name: "Inquiry", hasActivePlan: true, planStatus: "draft", completionPercentage: 60 },
    ],
  },
  {
    id: "5",
    name: "Class 8-A",
    grade: "Grade 8",
    studentCount: 26,
    subjects: [
      { id: "5a", name: "English Language & Literature", hasActivePlan: true, planStatus: "published", completionPercentage: 90 },
      { id: "5b", name: "Mathematics", hasActivePlan: true, planStatus: "draft", completionPercentage: 35 },
      { id: "5c", name: "Sciences", hasActivePlan: true, planStatus: "published", completionPercentage: 70 },
      { id: "5d", name: "Physical Education", hasActivePlan: false },
    ],
  },
  {
    id: "6",
    name: "Class 6-B",
    grade: "Grade 6",
    studentCount: 24,
    subjects: [
      { id: "6a", name: "English", hasActivePlan: true, planStatus: "draft", completionPercentage: 25 },
      { id: "6b", name: "Mathematics", hasActivePlan: true, planStatus: "published", completionPercentage: 95 },
      { id: "6c", name: "Arts", hasActivePlan: false },
      { id: "6d", name: "Music", hasActivePlan: true, planStatus: "draft", completionPercentage: 15 },
    ],
  },
];
