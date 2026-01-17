import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

import { getFullPlanningProgress, getClasses } from "@/lib/demoStorage";

const months = [
  "June 2024", "July 2024", "August 2024", "September 2024", "October 2024",
  "November 2024", "December 2024", "January 2025", "February 2025"
];

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("class") || "";
  const subjectId = searchParams.get("subject") || "";

  const classes = getClasses();
  const selectedClass = classes.find(c => c.id === classId);
  const selectedSubject = selectedClass?.subjects.find(s => s.id === subjectId);

  const monthlyProgress = getFullPlanningProgress(subjectId, months);

  const totalConcepts = monthlyProgress.reduce((acc, m) => acc + m.totalConcepts, 0);
  const coveredConcepts = monthlyProgress.reduce((acc, m) => acc + m.conceptsCovered, 0);
  const totalTopics = monthlyProgress.reduce((acc, m) => acc + m.totalTopics, 0);
  const coveredTopics = monthlyProgress.reduce((acc, m) => acc + m.topicsCovered, 0);
  const syllabusPercentage = Math.round((coveredTopics / totalTopics) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-warning" />;
      case "planned":
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/classes")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Progress Report</h1>
            <p className="text-muted-foreground">
              {selectedClass?.name || "Class"} — {selectedSubject?.name || "Subject"}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Syllabus Coverage</CardDescription>
              <CardTitle className="text-3xl">{syllabusPercentage}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={syllabusPercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Concepts Covered</CardDescription>
              <CardTitle className="text-3xl">{coveredConcepts}/{totalConcepts}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(coveredConcepts / totalConcepts) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Topics Completed</CardDescription>
              <CardTitle className="text-3xl">{coveredTopics}/{totalTopics}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(coveredTopics / totalTopics) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Months Status</CardDescription>
              <CardTitle className="text-3xl">
                {monthlyProgress.filter(m => m.status === "completed").length}/{monthlyProgress.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={(monthlyProgress.filter(m => m.status === "completed").length / monthlyProgress.length) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Monthly Progress Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>
              Detailed breakdown of syllabus coverage by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Concepts</TableHead>
                  <TableHead className="text-center">Topics</TableHead>
                  <TableHead className="text-center">Assessments</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyProgress.map((month) => {
                  const monthProgress = month.totalTopics > 0
                    ? Math.round((month.topicsCovered / month.totalTopics) * 100)
                    : 0;
                  return (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(month.status)}
                          {month.month}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(month.status)}</TableCell>
                      <TableCell className="text-center">
                        {month.conceptsCovered}/{month.totalConcepts}
                      </TableCell>
                      <TableCell className="text-center">
                        {month.topicsCovered}/{month.totalTopics}
                      </TableCell>
                      <TableCell className="text-center">
                        {month.assessmentsCompleted}/{month.totalAssessments}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={monthProgress} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground w-10">
                            {monthProgress}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Timeline View */}
        <Card className="border-border mt-6">
          <CardHeader>
            <CardTitle>Academic Timeline</CardTitle>
            <CardDescription>
              Visual representation of the academic year progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {monthlyProgress.map((month, index) => {
                const progress = month.totalTopics > 0
                  ? (month.topicsCovered / month.totalTopics) * 100
                  : 0;
                return (
                  <div key={month.month} className="flex-1">
                    <div
                      className={`h-16 rounded-lg border-2 flex items-end overflow-hidden ${month.status === "completed"
                        ? "border-success"
                        : month.status === "in_progress"
                          ? "border-warning"
                          : "border-border"
                        }`}
                    >
                      <div
                        className={`w-full transition-all ${month.status === "completed"
                          ? "bg-success/30"
                          : month.status === "in_progress"
                            ? "bg-warning/30"
                            : "bg-muted"
                          }`}
                        style={{ height: `${Math.max(progress, 10)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {month.month.split(" ")[0].slice(0, 3)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Report;
