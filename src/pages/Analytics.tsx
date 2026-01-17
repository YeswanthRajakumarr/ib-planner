import { AppHeader } from "@/components/layout/AppHeader";
import { getClasses } from "@/lib/demoStorage";
import { theme, chartColors } from "@/lib/theme";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Users,
    Target
} from "lucide-react";

const Analytics = () => {
    const classes = getClasses();

    // Data preparation for Completion by Grade
    const gradeData = classes.map(cls => ({
        name: cls.name,
        completion: Math.round(
            cls.subjects.reduce((acc, sub) => acc + (sub.completionPercentage || 0), 0) /
            cls.subjects.length
        )
    }));

    // Data preparation for Status distribution
    const allSubjects = classes.flatMap(c => c.subjects);
    const statusData = [
        { name: 'Published', value: allSubjects.filter(s => s.planStatus === 'published').length, color: chartColors.success },
        { name: 'Draft', value: allSubjects.filter(s => s.planStatus === 'draft').length, color: chartColors.warning },
        { name: 'Not Started', value: allSubjects.filter(s => !s.planStatus).length, color: chartColors.muted },
    ];

    // Data for Subject Category completion (MOCK categories for demo)
    const categoryData = [
        { category: 'Languages', completion: 65, fill: chartColors.primary },
        { category: 'Math', completion: 45, fill: chartColors.blue },
        { category: 'Sciences', completion: 25, fill: chartColors.cyan },
        { category: 'Arts & Design', completion: 15, fill: chartColors.purple },
    ];

    const totalClasses = classes.length;
    const totalSubjects = allSubjects.length;
    const publishedCount = statusData[0].value;
    const avgCompletion = Math.round(
        allSubjects.reduce((acc, s) => acc + (s.completionPercentage || 0), 0) / totalSubjects
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader />

            <main className={`flex-grow ${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
                <div className={`${theme.spacing.header.titleSpacing} ${theme.spacing.section.marginBottom}`}>
                    <h1 className={theme.typography.pageTitle}>Institutional Analytics</h1>
                    <p className={theme.typography.pageDescription}>Strategic overview of curriculum planning and coverage.</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Active Classes", value: totalClasses, icon: Users, color: "bg-blue-500/10 text-blue-500" },
                        { label: "Total Subjects", value: totalSubjects, icon: Target, color: "bg-indigo-500/10 text-indigo-500" },
                        { label: "Published Plans", value: publishedCount, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500" },
                        { label: "Avg. Completion", value: `${avgCompletion}%`, icon: TrendingUp, color: "bg-amber-500/10 text-amber-500" },
                    ].map((stat, i) => (
                        <Card key={i} className="rounded-xl border-border/50 shadow-sm overflow-hidden bg-card/50">
                            <CardContent className="p-3 flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                    <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2 rounded-2xl border-border/50 bg-card/50 shadow-lg overflow-hidden">
                        <CardHeader className="px-4 pt-4 pb-2">
                            <CardTitle className="text-base font-bold">Planning Progress by Class</CardTitle>
                            <CardDescription className="text-xs">Avg. completion across subjects.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gradeData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                                            dy={5}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10 }}
                                            domain={[0, 100]}
                                            unit="%"
                                            width={35}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Bar
                                            dataKey="completion"
                                            fill="#6366f1"
                                            radius={[6, 6, 0, 0]}
                                            barSize={30}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="rounded-2xl border-border/50 bg-card/50 shadow-lg overflow-hidden">
                        <CardHeader className="px-4 pt-4 pb-2">
                            <CardTitle className="text-base font-bold">Status Distribution</CardTitle>
                            <CardDescription className="text-xs">Planning milestones.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 flex flex-col items-center">
                            <div className="h-[160px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={6}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={24}
                                            iconType="circle"
                                            iconSize={6}
                                            formatter={(value) => <span className="text-[9px] font-bold text-muted-foreground mr-2 uppercase">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full space-y-1.5 mt-3">
                                {statusData.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                            <span className="text-xs font-semibold text-foreground">{s.name}</span>
                                        </div>
                                        <span className="text-xs font-bold">{s.value} <span className="text-[9px] text-muted-foreground">units</span></span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Progress */}
                    <Card className="rounded-2xl border-border/50 bg-card/50 shadow-lg overflow-hidden lg:col-span-3">
                        <CardHeader className="px-4 pt-4 pb-2">
                            <CardTitle className="text-base font-bold">Completion by Subject Category</CardTitle>
                            <CardDescription className="text-xs">Horizontal alignment progress.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categoryData.map((cat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wide text-foreground">{cat.category}</span>
                                            <span className="text-xs font-bold text-primary">{cat.completion}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50">
                                            <div
                                                className="h-full transition-all duration-1000"
                                                style={{
                                                    width: `${cat.completion}%`,
                                                    backgroundColor: cat.fill,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
