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
    SearchX
} from "lucide-react";
import { useState } from "react";

const Curriculum = () => {
    const navigate = useNavigate();
    const classes = getClasses();
    const [search, setSearch] = useState("");

    // Flatten all subjects into a single list
    const allSubjects = classes.flatMap(cls =>
        cls.subjects.map(sub => ({
            ...sub,
            className: cls.name,
            grade: cls.grade,
            classId: cls.id
        }))
    );

    const filteredSubjects = allSubjects.filter(sub =>
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.className.toLowerCase().includes(search.toLowerCase())
    );

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

                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search subjects..."
                                className="pl-9 h-9 rounded-lg border-border/50 bg-card shadow-sm text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 w-9 rounded-lg p-0 border-border/50 bg-card shadow-sm">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-lg">
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
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map((sub, idx) => (
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
            </main>
        </div>
    );
};

export default Curriculum;
