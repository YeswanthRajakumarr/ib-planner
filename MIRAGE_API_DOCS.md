# Mirage JS Mock API Documentation

This document outlines all the Mock API endpoints implemented using Mirage JS for the IB Academic Planner application.

## Base URL
All endpoints are prefixed with `/api` in development mode.

---

## Authentication

### POST /api/login
Authenticates a user.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "user": {
    "name": "string",
    "id": "string"
  },
  "token": "string"
}
```

### GET /api/user/profile
Retrieves the current user's profile.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

## Classes & Subjects

### GET /api/classes
Retrieves all classes with nested subjects.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "grade": " string",
    "studentCount": number,
    "subjects": [
      {
        "id": "string",
        "name": "string",
        "hasActivePlan": boolean,
        "planStatus": "draft" | "published",
        "completionPercentage": number
      }
    ]
  }
]
```

### PATCH /api/classes/:classId/subjects/:subjectId
Updates a subject's status and completion.

**Request Body:**
```json
{
  "planStatus": "draft" | "published",
  "completionPercentage": number,
  "hasActivePlan": boolean
}
```

**Response:**
Returns the updated subject object.

---

## Planning Data

### GET /api/planning/:subjectId/:month
Fetches the detailed plan for a specific subject and month.

**Response:**
```json
{
  "concepts": [
    {
      "id": "string",
      "name": "string",
      "topics": [
        { "id": "string", "name": "string" }
      ]
    }
  ],
  "outcomes": [
    { "id": "string", "content": "string" }
  ],
  "process": [
    {
      "id": "string",
      "content": "string",
      "linkedTopic": "string"
    }
  ],
  "assessment": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "grammar" | "writing" | "reading"
    }
  ],
  "weeklyPlan": []
}
```

### POST /api/planning/:subjectId/:month
Saves or updates planning data for a specific section or the entire month.

**Request Body (Section Update):**
```json
{
  "section": "concepts" | "outcomes" | "process" | "assessment" | "weeklyPlan",
  "content": any
}
```

**Request Body (Full Update):**
```json
{
  "concepts": [],
  "outcomes": [],
  "process": [],
  "assessment": [],
  "weeklyPlan": []
}
```

**Response:**
```json
{ "success": true }
```

---

## Progress Tracking

### GET /api/planning/:subjectId/progress
Retrieves which months have been completed for a subject.

**Response:**
```json
[0, 1, 2, 5]  // Array of month indices
```

### POST /api/planning/:subjectId/progress
Marks a specific month as completed.

**Request Body:**
```json
{
  "monthIndex": number
}
```

**Response:**
```json
{ "success": true }
```

---

## AI Suggestions

### POST /api/ai/suggestions
Generates AI-powered suggestions for planning.

**Request Body:**
```json
{
  "type": "outcomes" | "assessments" | "process",
  "month": "string",
  "concepts": ["string"],
  "topics": ["string"],
  "existingItems": ["string"]
}
```

**Response (type: outcomes):**
```json
{
  "suggestions": ["string"]
}
```

**Response (type: assessments):**
```json
{
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "category": "grammar" | "writing" | "reading"
    }
  ]
}
```

**Response (type: process):**
```json
{
  "suggestions": ["string"]
}
```

---

## Models

The Mirage server uses the following models:

1. **Class** - hasMany subjects
2. **Subject** - belongsTo class, hasMany plans
3. **Plan** - belongsTo subject, contains planning data blob
4. **User** - Stores user profile data
5. **Completion** - belongsTo subject, tracks completed months

---

## Configuration

The server runs with:
- **Environment**: development
- **Timing**: 500ms delay on all requests
- **Namespace**: `/api`

---

## Usage Example

```typescript
// Fetch classes
const classes = await fetch('/api/classes').then(r => r.json());

// Update subject status
await fetch(`/api/classes/${classId}/subjects/${subjectId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    planStatus: 'published',
    completionPercentage: 100,
    hasActivePlan: true
  })
});

// Get planning data
const plan = await fetch(`/api/planning/${subjectId}/June 2024`)
  .then(r => r.json());

// Save concepts
await fetch(`/api/planning/${subjectId}/June 2024`, {
  method: 'POST',
  body: JSON.stringify({
    section: 'concepts',
    content: [...]
  })
});

// Get AI suggestions
const suggestions = await fetch('/api/ai/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'outcomes',
    month: 'June 2024',
    concepts: ['Grammar', 'Writing']
  })
}).then(r => r.json());
```

---

## Notes

- All endpoints return JSON
- The server automatically seeds data from `mockData.ts` and preset planning data on startup
- Passthrough rules ensure Vite development assets are not intercepted
- Server is only active in development mode (`import.meta.env.DEV`)
