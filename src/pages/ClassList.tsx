import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Pencil,
  Users,
  BookOpen,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Search,
  Filter,
  SortAsc,
  ChevronDown
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { WeeklyReportDialog } from "@/components/planner/WeeklyReportDialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { theme } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getClasses } from "@/lib/demoStorage";
import { ClassData } from "@/data/mockData";

const ClassList = () => {
  const navigate = useNavigate();
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");

  useEffect(() => {
    const data = getClasses();
    setAllClasses(data);
    setFilteredClasses(data);
  }, []);

  useEffect(() => {
    let result = [...allClasses];

    // Search
    if (searchQuery) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter
    if (gradeFilter !== "all") {
      result = result.filter(c => c.grade === gradeFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "students-desc") return (b.studentCount || 0) - (a.studentCount || 0);
      if (sortBy === "students-asc") return (a.studentCount || 0) - (b.studentCount || 0);
      return 0;
    });

    setFilteredClasses(result);
  }, [searchQuery, gradeFilter, sortBy, allClasses]);

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

  const handleOpenReport = (classItem: ClassData, subject: any) => {
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

  const grades = Array.from(new Set(allClasses.map(c => c.grade))).sort();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className={`${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
        {/* Welcome Section */}
        <section className={`${theme.spacing.section.marginBottom} relative overflow-hidden ${theme.radius.xl} p-8 lg:p-10 border border-primary/10 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent`}>
          <div className="relative z-10 max-w-2xl">
            <Badge variant="outline" className="mb-3 py-1 px-3 border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-tight uppercase">
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
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">12 Published Units</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full shadow-sm">
                <Clock className="w-4 h-4 text-amber-500" />
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

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-9 h-10 rounded-xl border-border/50 bg-card/50 shadow-sm transition-all focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl border-border/50 bg-card/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Grades" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl border-border/50 bg-card/50 shadow-sm px-3 flex items-center gap-2">
                  {sortBy.includes('students') ? <Users className="w-3.5 h-3.5 text-primary" /> : <SortAsc className="w-3.5 h-3.5 text-primary" />}
                  <span className="text-sm font-medium">Sort</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("name-asc")} className="flex justify-between items-center py-2 cursor-pointer">
                  <span>Name (A-Z)</span>
                  {sortBy === "name-asc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")} className="flex justify-between items-center py-2 cursor-pointer">
                  <span>Name (Z-A)</span>
                  {sortBy === "name-desc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("students-desc")} className="flex justify-between items-center py-2 cursor-pointer">
                  <span>Students (More)</span>
                  {sortBy === "students-desc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("students-asc")} className="flex justify-between items-center py-2 cursor-pointer">
                  <span>Students (Less)</span>
                  {sortBy === "students-asc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-8 w-[1px] bg-border/50 mx-1 hidden md:block" />

            {/* View Toggle */}
            <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/50">
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 px-2.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 px-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Active Classes</h2>
            <p className="text-sm text-muted-foreground">Showing {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-sm border-primary/20 hover:bg-primary/5 h-8 text-[11px] font-bold uppercase tracking-wider"
            onClick={() => navigate("/calendar")}
          >
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Full Calendar
          </Button>
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
              <div className="flex gap-4 w-max p-1">
                {filteredClasses.map((classItem) => (
                  <Card key={classItem.id} className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden w-[340px] flex-shrink-0 rounded-2xl">
                    <CardHeader className="pb-3 pt-5 px-5 bg-muted/10 border-b border-border/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-background rounded-2xl flex items-center justify-center border border-border shadow-sm group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-bold text-foreground">{classItem.name}</CardTitle>
                            <CardDescription className="text-xs font-medium">{classItem.studentCount} Students • {classItem.subjects.length} Subjects</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-black tracking-widest uppercase py-0.5 px-2 bg-primary/5 text-primary border-primary/10">
                          {classItem.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4 px-5 flex-grow bg-card/30">
                      <div className="space-y-4">
                        {classItem.subjects.map((subject) => (
                          <div key={subject.id} className="relative group/subject">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary/20 rounded-full group-hover/subject:bg-primary transition-colors" />
                                <span className="font-bold text-sm text-foreground/90">{subject.name}</span>
                              </div>
                              {getStatusBadge(subject.planStatus, subject.hasActivePlan)}
                            </div>

                            {subject.hasActivePlan ? (
                              <div className="space-y-2 pl-3">
                                <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                  <span>Planning Status</span>
                                  <span className="text-primary">{subject.completionPercentage}%</span>
                                </div>
                                <Progress value={subject.completionPercentage} className="h-1.5 bg-muted/50" />
                                <div className="flex gap-2 pt-1 opacity-0 group-hover/subject:opacity-100 transition-all transform translate-y-1 group-hover/subject:translate-y-0">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-7 text-[10px] font-black uppercase tracking-wider px-3 rounded-full flex-1 bg-background hover:bg-primary/5 hover:text-primary border border-border/50"
                                    onClick={() => handleOpenReport(classItem, subject)}
                                  >
                                    <FileText className="w-3 h-3 mr-1.5" />
                                    Review
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-[10px] font-black uppercase tracking-wider px-3 rounded-full flex-1 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                    onClick={() => handleEditPlan(classItem.id, subject.id)}
                                  >
                                    <Pencil className="w-3 h-3 mr-1.5" />
                                    Modify
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="ml-3 bg-muted/20 border border-dashed border-border/60 rounded-xl p-3 text-center group-hover/subject:border-primary/30 group-hover/subject:bg-primary/[0.02] transition-all">
                                <p className="text-[10px] text-muted-foreground mb-2 font-black uppercase tracking-widest">Awaiting Plan</p>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 text-[10px] font-black uppercase tracking-wider px-4 rounded-full shadow-lg shadow-primary/10"
                                  onClick={() => handleCreatePlan(classItem.id, subject.id)}
                                >
                                  <Plus className="w-3 h-3 mr-1.5" />
                                  Initialize
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 px-5">
                      <Button variant="ghost" className="w-full justify-between text-[11px] font-black uppercase tracking-[0.15em] text-primary group-hover:bg-primary/5 rounded-xl px-4 py-2 hover:translate-x-1 transition-all">
                        Full Class Insight
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
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="group border-border/50 hover:border-primary/30 hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 md:gap-4 p-3.5 md:p-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-muted/20 rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <h3 className="font-bold text-sm md:text-base text-foreground truncate">{classItem.name}</h3>
                      <Badge variant="secondary" className="text-[9px] font-black tracking-widest uppercase py-0.5 px-2 bg-primary/5 text-primary flex-shrink-0">
                        {classItem.grade}
                      </Badge>
                    </div>
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground">{classItem.studentCount} Students • {classItem.subjects.length} Subjects</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end max-w-[200px]">
                    {classItem.subjects.slice(0, 2).map((s) => (
                      <Badge
                        key={s.id}
                        variant="outline"
                        className={`text-[9px] font-bold border-border/50 ${s.planStatus === 'published' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20' : s.hasActivePlan ? 'bg-amber-500/5 text-amber-600 border-amber-500/20' : 'text-muted-foreground'}`}
                      >
                        {s.name.split(' ')[0]}
                      </Badge>
                    ))}
                    {classItem.subjects.length > 2 && (
                      <Badge variant="outline" className="text-[9px] font-bold">+{classItem.subjects.length - 2}</Badge>
                    )}
                  </div>
                  <div className="h-8 w-[1px] bg-border/20 mx-1 md:mx-2 flex-shrink-0" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl w-9 h-9 md:w-10 md:h-10 hover:bg-primary/5 hover:text-primary transition-all active:scale-95 flex-shrink-0"
                    onClick={() => handleEditPlan(classItem.id, classItem.subjects[0].id)}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredClasses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/60">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No classes found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => {
                setSearchQuery("");
                setGradeFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      <WeeklyReportDialog
        open={reportDialog.open}
        onOpenChange={(open) => setReportDialog((prev) => ({ ...prev, open }))}
        subjectName={reportDialog.subjectName}
      />
    </div>
  );
};

export default ClassList;
