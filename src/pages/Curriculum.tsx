import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { getClasses } from "@/lib/demoStorage";
import { theme, getStatusClasses } from "@/lib/theme";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    BookOpen,
    Edit3,
    BarChart3,
    SearchX,
    ChevronDown,
    SortAsc
} from "lucide-react";
import { useState, useMemo } from "react";
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

const Curriculum = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const classes = getClasses();

    // Flatten all subjects into a single list
    const allSubjects = useMemo(() => classes.flatMap(cls =>
        cls.subjects.map(sub => ({
            ...sub,
            className: cls.name,
            grade: cls.grade,
            classId: cls.id
        }))
    ), [classes]);

    const filteredSubjects = useMemo(() => {
        let result = allSubjects.filter(sub =>
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.className.toLowerCase().includes(search.toLowerCase())
        );

        if (gradeFilter !== "all") {
            result = result.filter(sub => sub.grade === gradeFilter);
        }

        if (statusFilter !== "all") {
            const filterVal = statusFilter === "not_started" ? undefined : statusFilter;
            result = result.filter(sub => sub.planStatus === filterVal);
        }

        result.sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            if (sortBy === "progress-desc") return (b.completionPercentage || 0) - (a.completionPercentage || 0);
            if (sortBy === "progress-asc") return (a.completionPercentage || 0) - (b.completionPercentage || 0);
            return 0;
        });

        // Reset to first page when filtering/searching
        setCurrentPage(1);

        return result;
    }, [allSubjects, search, gradeFilter, statusFilter, sortBy]);

    const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
    const paginatedSubjects = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSubjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredSubjects, currentPage]);

    const grades = useMemo(() => Array.from(new Set(allSubjects.map(s => s.grade))).sort(), [allSubjects]);

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "published":
                return <Badge className={`${theme.status.success.bg} ${theme.status.success.text} ${theme.radius.full} px-3`}>Published</Badge>;
            case "draft":
                return <Badge variant="secondary" className={`${theme.radius.full} px-3`}>Draft</Badge>;
            default:
                return <Badge variant="outline" className={`${theme.radius.full} px-3 opacity-50`}>Not Started</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader />

            <main className={`flex-grow ${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between ${theme.spacing.section.gap} ${theme.spacing.section.marginBottom}`}>
                    <div className={theme.spacing.header.titleSpacing}>
                        <h1 className={theme.typography.pageTitle}>Academic Curriculum</h1>
                        <p className={theme.typography.pageDescription}>All subjects and planning statuses across Grade 5-12.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full md:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 h-9 rounded-lg border-border/50 bg-card shadow-sm text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={gradeFilter} onValueChange={setGradeFilter}>
                            <SelectTrigger className="w-full md:w-[130px] h-9 rounded-lg border-border/50 bg-card shadow-sm text-xs font-semibold">
                                <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {grades.map(grade => (
                                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[130px] h-9 rounded-lg border-border/50 bg-card shadow-sm text-xs font-semibold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="not_started">Not Started</SelectItem>
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/50 bg-card shadow-sm px-3 flex items-center gap-2">
                                    <SortAsc className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-semibold">Sort</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Order By</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy("name-asc")} className="flex justify-between items-center py-2 cursor-pointer text-xs font-medium">
                                    <span>Subject (A-Z)</span>
                                    {sortBy === "name-asc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("name-desc")} className="flex justify-between items-center py-2 cursor-pointer text-xs font-medium">
                                    <span>Subject (Z-A)</span>
                                    {sortBy === "name-desc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy("progress-desc")} className="flex justify-between items-center py-2 cursor-pointer text-xs font-medium">
                                    <span>Progress (High)</span>
                                    {sortBy === "progress-desc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("progress-asc")} className="flex justify-between items-center py-2 cursor-pointer text-xs font-medium">
                                    <span>Progress (Low)</span>
                                    {sortBy === "progress-asc" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-lg mb-6">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="py-3 px-4 font-bold text-[10px] uppercase tracking-widest">Subject</TableHead>
                                <TableHead className="py-3 px-4 font-bold text-[10px] uppercase tracking-widest">Grade / Class</TableHead>
                                <TableHead className="py-3 px-4 font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                                <TableHead className="py-3 px-4 font-bold text-[10px] uppercase tracking-widest text-center">Progress</TableHead>
                                <TableHead className="py-3 px-4 font-bold text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedSubjects.length > 0 ? (
                                paginatedSubjects.map((sub, idx) => (
                                    <TableRow key={`${sub.id}-${idx}`} className="group hover:bg-muted/20 border-border/30 transition-colors">
                                        <TableCell className="py-2.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-sm">{sub.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-foreground">{sub.className}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{sub.grade}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4">
                                            {getStatusBadge(sub.planStatus)}
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 text-center">
                                            <div className="inline-flex items-center justify-center min-w-[40px] px-1.5 py-0.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold border border-primary/10">
                                                {sub.completionPercentage || 0}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    onClick={() => navigate(`/planner?class=${sub.classId}&subject=${sub.id}`)}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    onClick={() => navigate(`/report?class=${sub.classId}&subject=${sub.id}`)}
                                                >
                                                    <BarChart3 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
                                            <SearchX className="w-8 h-8 opacity-20" />
                                            <p>No subjects found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)}</span> of <span className="font-medium text-foreground">{filteredSubjects.length}</span> items
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-border/50 bg-card shadow-sm px-3"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "ghost"}
                                        size="icon"
                                        className={`w-8 h-8 rounded-lg ${currentPage === page ? "shadow-md" : "hover:bg-primary/10"}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        <span className="text-xs font-bold">{page}</span>
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-border/50 bg-card shadow-sm px-3"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Curriculum;
