import { AppHeader } from "@/components/layout/AppHeader";
import { theme } from "@/lib/theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    AlertCircle,
    GraduationCap,
    CalendarDays,
    Filter
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Event {
    id: string;
    title: string;
    date: Date;
    type: "academic" | "holiday" | "exam";
    location?: string;
}

interface Holiday {
    day: number;
    month: number;
    name: string;
    type: "national" | "regional" | "school";
}

const AcademicCalendar = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

    // Holidays data for Jan, Feb, Mar 2026
    const holidays: Holiday[] = [
        // January
        { day: 14, month: 0, name: "Pongal / Makar Sankranti", type: "regional" },
        { day: 23, month: 0, name: "Netaji Jayanti", type: "school" },
        { day: 26, month: 0, name: "Republic Day", type: "national" },
        // February
        { day: 1, month: 1, name: "Saraswati Puja", type: "school" },
        { day: 19, month: 1, name: "Shivaji Jayanti", type: "regional" },
        { day: 26, month: 1, name: "Maha Shivaratri", type: "national" },
        // March
        { day: 14, month: 2, name: "Holi", type: "national" },
        { day: 17, month: 2, name: "Holika Dahan", type: "regional" },
        { day: 25, month: 2, name: "Ugadi / Gudi Padwa", type: "regional" },
        { day: 29, month: 2, name: "Good Friday", type: "national" },
    ];

    const getHolidaysForMonth = (selectedDate: Date | undefined) => {
        if (!selectedDate) return [];
        const month = selectedDate.getMonth();
        return holidays.filter(h => h.month === month).sort((a, b) => a.day - b.day);
    };

    const getHolidayColor = (type: string) => {
        switch (type) {
            case "national": return { bg: "bg-emerald-500/5", border: "border-emerald-500/20", dateBg: "bg-emerald-500/10", dateText: "text-emerald-600", dayText: "text-emerald-700" };
            case "regional": return { bg: "bg-amber-500/5", border: "border-amber-500/20", dateBg: "bg-amber-500/10", dateText: "text-amber-600", dayText: "text-amber-700" };
            case "school": return { bg: "bg-blue-500/5", border: "border-blue-500/20", dateBg: "bg-blue-500/10", dateText: "text-blue-600", dayText: "text-blue-700" };
            default: return { bg: "bg-muted/10", border: "border-border", dateBg: "bg-muted/20", dateText: "text-muted-foreground", dayText: "text-foreground" };
        }
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthHolidays = getHolidaysForMonth(date);

    const events: Event[] = useMemo(() => [
        { id: "1", title: "Term 1 Start", date: new Date(2024, 5, 3), type: "academic", location: "Main Hall" },
        { id: "2", title: "Staff Professional Development", date: new Date(2024, 5, 7), type: "academic" },
        { id: "3", title: "Diagnostic Assessments", date: new Date(2024, 5, 12), type: "exam" },
        { id: "4", title: "Summer Integration Week", date: new Date(2024, 5, 20), type: "academic" },
        { id: "5", title: "Public Holiday", date: new Date(2024, 6, 17), type: "holiday" },
    ], []);

    const filteredEvents = useMemo(() => {
        if (eventTypeFilter === "all") return events;
        return events.filter(e => e.type === eventTypeFilter);
    }, [events, eventTypeFilter]);

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "academic": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "holiday": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
            case "exam": return "bg-rose-500/10 text-rose-600 border-rose-200";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader />

            <main className={`flex-grow ${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between ${theme.spacing.section.gap} ${theme.spacing.section.marginBottom}`}>
                    <div className={theme.spacing.header.titleSpacing}>
                        <h1 className={theme.typography.pageTitle}>Academic Calendar</h1>
                        <p className={theme.typography.pageDescription}>Key milestones for the 2024-25 session.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                            <SelectTrigger className="w-[140px] h-9 rounded-lg border-border/50 bg-card shadow-sm text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="All Events" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="holiday">Holiday</SelectItem>
                                <SelectItem value="exam">Exam</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className={`flex items-center gap-2 bg-primary/5 px-3 py-1.5 ${theme.radius.sm} border border-primary/10`}>
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span className={theme.typography.labelSm}>Term 1 (2024)</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Calendar View */}
                    <Card className="rounded-2xl border-border/50 bg-card shadow-lg overflow-hidden">
                        <CardContent className="p-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border-none p-0 w-full"
                                classNames={{
                                    months: "w-full",
                                    month: "space-y-2 w-full",
                                    caption: "flex justify-center pt-1 relative items-center mb-2",
                                    caption_label: "text-base font-bold",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all rounded-lg hover:bg-muted",
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse",
                                    head_row: "flex w-full mb-1",
                                    head_cell: "text-muted-foreground rounded-md w-full font-bold text-[9px] uppercase tracking-widest",
                                    row: "flex w-full mt-1",
                                    cell: "h-9 w-full text-center text-xs p-0 relative",
                                    day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-muted rounded-lg transition-all mx-auto flex items-center justify-center",
                                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                    day_today: "bg-primary/10 text-primary border border-primary/20",
                                    day_outside: "text-muted-foreground opacity-30",
                                    day_disabled: "text-muted-foreground opacity-30",
                                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                    day_hidden: "invisible",
                                }}
                            />

                            {/* Holidays This Month */}
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Holidays This Month</h4>
                                <div className="space-y-2">
                                    {currentMonthHolidays.length > 0 ? (
                                        currentMonthHolidays.map((holiday, idx) => {
                                            const colors = getHolidayColor(holiday.type);
                                            return (
                                                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                                                    <div className={`w-8 h-8 rounded-lg ${colors.dateBg} flex flex-col items-center justify-center`}>
                                                        <span className={`text-[8px] font-bold ${colors.dateText} uppercase leading-none`}>{monthNames[holiday.month]}</span>
                                                        <span className={`text-xs font-bold ${colors.dayText}`}>{holiday.day}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">{holiday.name}</p>
                                                        <p className="text-[10px] text-muted-foreground capitalize">{holiday.type} Holiday</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-muted-foreground py-2">No holidays this month</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="rounded-2xl border-border/50 bg-card shadow-lg h-full">
                            <CardHeader className="px-4 pt-4 pb-2 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-bold">Upcoming Milestones</CardTitle>
                                    <p className="text-xs text-muted-foreground">Strategic dates for Term 1</p>
                                </div>
                                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-bold text-primary">View All</Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <div className="space-y-2">
                                    {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-background border border-border/50 flex flex-col items-center justify-center shadow-sm">
                                                    <span className="text-[8px] uppercase font-bold text-muted-foreground leading-none">
                                                        {event.date.toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    <span className="text-sm font-bold text-foreground">
                                                        {event.date.getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> 09:00</span>
                                                        {event.location && (
                                                            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {event.location}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`rounded-full px-2 py-0.5 font-bold text-[9px] uppercase ${getBadgeColor(event.type)}`}>
                                                {event.type}
                                            </Badge>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-muted-foreground text-center py-10">No events found for this category.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Term Overview */}
                <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="rounded-xl border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader className="pb-1 pt-4 px-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <CardTitle className="text-sm font-bold">Term 1</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-xs text-muted-foreground mb-2">Diagnostic assessments and unit foundations.</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Duration</p>
                                    <p className="text-xs font-bold">June - Aug 2024</p>
                                </div>
                                <Badge className="bg-primary/20 text-primary border-none text-[9px]">Active</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border/50 bg-card/50 opacity-60">
                        <CardHeader className="pb-1 pt-4 px-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-bold">Term 2</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-xs text-muted-foreground mb-2">Mid-term inquiries and alignment review.</p>
                            <div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Duration</p>
                                <p className="text-xs font-bold">Sept - Nov 2024</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border/50 bg-card/50 opacity-60">
                        <CardHeader className="pb-1 pt-4 px-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-bold">Term 3</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-xs text-muted-foreground mb-2">Culminating projects and final assessments.</p>
                            <div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Duration</p>
                                <p className="text-xs font-bold">Dec - Feb 2025</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default AcademicCalendar;
