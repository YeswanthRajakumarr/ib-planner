import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Pencil, Users, BookOpen, Calendar, ArrowRight, CheckCircle2, Clock, LayoutGrid, List } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { WeeklyReportDialog } from "@/components/planner/WeeklyReportDialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { theme } from "@/lib/theme";

import { getClasses } from "@/lib/demoStorage";
import { ClassData } from "@/data/mockData";
import { useEffect } from "react";

const ClassList = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  useEffect(() => {
    setClasses(getClasses());
  }, []);
  const [reportDialog, setReportDialog] = useState<{
    open: boolean;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
  }>({ open: false, classId: "", className: "", subjectId: "", subjectName: "" });

  const handleCreatePlan = (classId: string, subjectId: string) => {
    navigate(`/create-plan?class=${classId}&subject=${subjectId}`);
  };

  const handleOpenReport = (classItem: ClassData, subject: typeof classItem.subjects[0]) => {
    setReportDialog({
      open: true,
      classId: classItem.id,
      className: classItem.name,
      subjectId: subject.id,
      subjectName: subject.name,
    });
  };

  const handleEditPlan = (classId: string, subjectId: string) => {
    navigate(`/planner?class=${classId}&subject=${subjectId}`);
  };

  const getStatusBadge = (status?: "draft" | "published", hasActivePlan?: boolean) => {
    if (!hasActivePlan) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] font-bold uppercase border-dashed border-muted-foreground/30 text-muted-foreground/50 px-2 py-0.5"
        >
          Not Started
        </Badge>
      );
    }

    return status === "published" ? (
      <Badge
        variant="default"
        className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase px-2 py-0.5 shadow-sm shadow-emerald-500/10 flex items-center gap-1"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Published
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold uppercase px-2 py-0.5 shadow-sm shadow-amber-500/10 flex items-center gap-1"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Draft
      </Badge>
    );
  };


  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className={`${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
        {/* Welcome Section */}
        <section className={`${theme.spacing.section.marginBottom} relative overflow-hidden ${theme.radius.xl} p-8 lg:p-10 border border-primary/10 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent`}>
          <div className="relative z-10 max-w-2xl">
            <Badge variant="outline" className="mb-3 py-1 px-3 border-primary/20 bg-primary/5 text-primary">
              Welcome back, Ms. K Aishwarya
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight leading-tight">
              Manage your <span className="text-primary italic">IB Journey</span> with precision
            </h1>
            <p className="text-base text-muted-foreground/80 mb-6 text-balance">
              Your dashboard provides a real-time overview of your units, assessments, and ATL skill tracking.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">12 Published Units</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full shadow-sm">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">4 Plans in Progress</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-primary">
              <circle cx="80" cy="20" r="40" />
            </svg>
          </div>
        </section>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Active Classes</h2>
            <p className="text-sm text-muted-foreground">Subjects and planning status</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 rounded-md"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 rounded-md"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-sm border-primary/20 hover:bg-primary/5"
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Card View - Horizontal scroll */}
        {viewMode === "card" && (
          <div className="relative">
            <div
              className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
              style={{
                scrollbarWidth: 'thin',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex gap-4 w-max">
                {classes.map((classItem) => (
                  <Card key={classItem.id} className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden w-[340px] flex-shrink-0">
                    <CardHeader className="pb-2 pt-4 px-4 bg-muted/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-background rounded-xl flex items-center justify-center border border-border shadow-sm">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-bold">{classItem.name}</CardTitle>
                            <CardDescription className="text-xs">{classItem.studentCount} Students • {classItem.subjects.length} Subjects</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[9px] font-bold tracking-wider uppercase py-0.5 px-2">
                          {classItem.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3 px-4 flex-grow">
                      <div className="space-y-3">
                        {classItem.subjects.map((subject) => (
                          <div key={subject.id} className="relative group/subject">
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-0.5 h-3.5 bg-primary/30 rounded-full" />
                                <span className="font-medium text-sm">{subject.name}</span>
                              </div>
                              {getStatusBadge(subject.planStatus, subject.hasActivePlan)}
                            </div>

                            {subject.hasActivePlan ? (
                              <div className="space-y-1.5 pl-2.5">
                                <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase">
                                  <span>Plan Progress</span>
                                  <span>{subject.completionPercentage}%</span>
                                </div>
                                <Progress value={subject.completionPercentage} className="h-1 bg-muted" />
                                <div className="flex gap-1.5 pt-0.5 opacity-0 group-hover/subject:opacity-100 transition-opacity">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-6 text-[9px] font-bold px-2 rounded-full flex-1"
                                    onClick={() => handleOpenReport(classItem, subject)}
                                  >
                                    <FileText className="w-2.5 h-2.5 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-[9px] font-bold px-2 rounded-full flex-1"
                                    onClick={() => handleEditPlan(classItem.id, subject.id)}
                                  >
                                    <Pencil className="w-2.5 h-2.5 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="ml-2.5 bg-muted/20 border border-dashed border-border/50 rounded-lg p-2 text-center">
                                <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase">No active plan</p>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-6 text-[9px] font-bold px-3 rounded-full"
                                  onClick={() => handleCreatePlan(classItem.id, subject.id)}
                                >
                                  <Plus className="w-2.5 h-2.5 mr-1" />
                                  Initialize
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3 px-4">
                      <Button variant="ghost" className="w-full justify-between text-xs font-bold text-primary group-hover:bg-primary/5 rounded-lg px-3 py-2">
                        Class Overview
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="group border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center border border-border">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{classItem.name}</h3>
                      <Badge variant="secondary" className="text-[9px] font-bold tracking-wider uppercase py-0.5 px-2">
                        {classItem.grade}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{classItem.studentCount} Students • {classItem.subjects.length} Subjects</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {classItem.subjects.slice(0, 3).map((s) => (
                      <Badge
                        key={s.id}
                        variant="outline"
                        className={`text-[9px] ${s.planStatus === 'published' ? 'border-emerald-500/30 text-emerald-600' : s.hasActivePlan ? 'border-amber-500/30 text-amber-600' : 'border-border text-muted-foreground'}`}
                      >
                        {s.name.split(' ')[0]}
                      </Badge>
                    ))}
                    {classItem.subjects.length > 3 && (
                      <Badge variant="outline" className="text-[9px]">+{classItem.subjects.length - 3}</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleEditPlan(classItem.id, classItem.subjects[0].id)}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <WeeklyReportDialog
        open={reportDialog.open}
        onOpenChange={(open) => setReportDialog((prev) => ({ ...prev, open }))}
        className={reportDialog.className}
        subjectName={reportDialog.subjectName}
      />
    </div>
  );
};

export default ClassList;
