import { createServer, Model, hasMany, belongsTo, Response } from "miragejs";
import { classesData } from "../data/mockData";

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

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      class: Model.extend({
        subjects: hasMany(),
      }),
      subject: Model.extend({
        class: belongsTo(),
        plans: hasMany(),
      }),
      plan: Model.extend({
        subject: belongsTo(),
      }),
      user: Model,
      completion: Model.extend({
        subject: belongsTo()
      })
    },

    seeds(server) {
      server.create("user", {
        // @ts-ignore
         id: "u1",
         name: "Ms. K Aishwarya",
         email: "k.aishwarya@hillridge.edu.in",
         role: "Head Facilitator"
      });

      // Load initial classes from mockData
      classesData.forEach((c) => {
         const classModel = server.create("class", {
            // @ts-ignore
            id: c.id,
            name: c.name,
            grade: c.grade,
            studentCount: c.studentCount
         });

         c.subjects.forEach((s) => {
            const subject = server.create("subject", {
               // @ts-ignore
               id: s.id,
               name: s.name,
               hasActivePlan: s.hasActivePlan,
               planStatus: s.planStatus,
               completionPercentage: s.completionPercentage || 0,
               class: classModel
            });

            // Seed preset plans if they exist
            Object.keys(PRESET_PLANNING_DATA).forEach(key => {
                const [pid, month] = key.split('_');
                if (pid === s.id) {
                    server.create("plan", {
                        // @ts-ignore
                        subjectId: s.id,
                        month: month,
                        data: PRESET_PLANNING_DATA[key]
                    });
                }
            });
         });
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 500;

      // Auth
      this.post("/login", (schema: any, request) => {
        let attrs = JSON.parse(request.requestBody);
        return { user: { name: "Ms. K Aishwarya", id: "u1" }, token: "mock-jwt-token" };
      });

      this.get("/user/profile", (schema: any) => {
         return schema.users.first()?.attrs || { name: "Guest" };
      });

      // Classes & Subjects
      this.get("/classes", (schema: any) => {
         let classes = schema.classes.all();
         
         // Custom serialization to match expected frontend structure (deep nest subjects)
         return classes.models.map((c: any) => {
            return {
               id: c.id,
               name: c.name,
               grade: c.grade,
               studentCount: c.studentCount,
               subjects: c.subjects.models.map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  hasActivePlan: s.hasActivePlan,
                  planStatus: s.planStatus,
                  completionPercentage: s.completionPercentage
               }))
            };
         });
      });

      this.patch("/classes/:classId/subjects/:subjectId", (schema: any, request) => {
        let { subjectId } = request.params;
        let attrs = JSON.parse(request.requestBody);
        let subject = schema.subjects.find(subjectId);
        if(subject) {
            subject.update(attrs);
            return subject;
        }
        return new Response(404);
      });

      // Planning Data
      this.get("/planning/:subjectId/:month", (schema: any, request) => {
        let { subjectId, month } = request.params;
        let plan = schema.plans.findBy({ subjectId, month });
        
        if (plan) {
            return plan.data;
        }

        // Return empty structure if not found
        return { concepts: [], outcomes: [], process: [], assessment: [], weeklyPlan: [] };
      });

      this.post("/planning/:subjectId/:month", (schema: any, request) => {
        let { subjectId, month } = request.params;
        let attrs = JSON.parse(request.requestBody); // This is likely { section: "concepts", content: [...] } or full object

        let plan = schema.plans.findBy({ subjectId, month });
        
        if (plan) {
           // We need to merge intelligently based on the payload structure
           // If payload has 'section', we update just that section in the blob
           let currentData = plan.data || {};
           
           if (attrs.section && attrs.content) {
               currentData[attrs.section] = attrs.content;
                plan.update({ data: currentData });
           } else {
               // Assume full replace or merge of top-level keys
               plan.update({ data: { ...currentData, ...attrs } });
           }
        } else {
           // Create new
           let initialData: any = {};
           if (attrs.section && attrs.content) {
               initialData[attrs.section] = attrs.content;
           } else {
               initialData = attrs;
           }
           schema.plans.create({ subjectId, month, data: initialData });
        }
        return { success: true };
      });

      // Progress Tracking
      this.get("/planning/:subjectId/progress", (schema: any, request) => {
         let { subjectId } = request.params;
         // In this mock, we can look at which plans exist, or use a dedicated 'completion' model
         // Logic: if a plan exists in the DB for that month, is it 'completed'?
         // The frontend sent explicit 'saveMonthCompleted' calls. Let's store them in a completion model.
         let completions = schema.completions.where({ subjectId });
         return completions.models.map((c: any) => c.monthIndex);
      });

      this.post("/planning/:subjectId/progress", (schema: any, request) => {
         let { subjectId } = request.params;
         let { monthIndex } = JSON.parse(request.requestBody);
         
         // Check if already exists
         let exists = schema.completions.findBy({ subjectId, monthIndex });
         if (!exists) {
             schema.completions.create({ subjectId, monthIndex });
         }
         return { success: true };
      });

      // AI Suggestions (Mock)
      this.post("/ai/suggestions", (schema: any, request) => {
         let { type, topics } = JSON.parse(request.requestBody);
         
         // Simulate delay
         // Note: timing is handled by this.timing globally, but individual delay is finer
         
         if(type === 'outcomes') {
             return {
                 suggestions: [
                    "Students will be able to analyze the impact of the core concepts on daily life.",
                    "Develop a critical perspective on the historical context of the topic.",
                    "Demonstrate mastery through practical application and project work.",
                    "Collaborate to solve complex problems related to the unit theme."
                 ]
             };
         } else if (type === 'assessments') {
             return {
                 suggestions: [
                     { title: "Creative Presentation", description: "Design a visual aid that explains the key mechanism.", category: "writing" },
                     { title: "Peer Debate", description: "Argue for or against the central premise using evidence.", category: "speaking" },
                     { title: "Concept Map", description: "Visually organize the relationships between topics.", category: "reading" }
                 ]
             };
         } else if (type === 'process') {
             const topic = topics?.[0] || "General";
             return {
                 suggestions: [
                    `Conduct a guided inquiry into ${topic} using primary sources.`,
                    `Small group workshop to practice skills related to ${topic}.`,
                    "Reflective journaling session to consolidate understanding.",
                    "Gallery walk to review peer work and provide feedback."
                 ]
             };
         }
         return { suggestions: [] };
      });
      
      this.passthrough((request) => {
        if (request.url.startsWith("/src/") || request.url.startsWith("/virtual:") || request.url.startsWith("/node_modules/")) return true;
        return false;
      });
    },
  });
}
