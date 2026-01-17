import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { theme } from "@/lib/theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Bell,
    Camera,
    LogOut,
    ChevronRight,
    Globe,
    Settings as SettingsIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader />

            <main className={`flex-grow ${theme.spacing.page.maxWidth} ${theme.spacing.page.padding}`}>
                <div className={`mb-8 ${theme.spacing.header.titleSpacing}`}>
                    <h1 className={theme.typography.pageTitle}>Facilitator Profile</h1>
                    <p className={theme.typography.pageDescription}>Manage your personal information and preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Profile Summary */}
                    <aside className="lg:col-span-4 space-y-6">
                        <Card className={`${theme.radius.lg} border-border/50 bg-card overflow-hidden shadow-sm`}>
                            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                            <CardContent className="px-6 pb-6 -mt-12 text-center">
                                <div className="relative inline-block mb-4">
                                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">KA</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg border-2 border-background">
                                        <Camera className="w-4 h-4" />
                                    </Button>
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Ms. K Aishwarya</h2>
                                <p className="text-sm text-primary font-medium">Head Facilitator • Middle Years Programme</p>
                                <p className="text-xs text-muted-foreground mt-1">Staff ID: HILL-2024-089</p>

                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    <div className="px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">English Literature</div>
                                    <div className="px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">Humanities</div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 border-t border-border/50 px-6 py-4">
                                <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => navigate("/")}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className={`${theme.radius.lg} border-border/50 bg-card shadow-sm`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    Account Verification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Email Status</span>
                                    <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Verified</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">MFA Status</span>
                                    <span className="text-amber-600 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Not Enabled</span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Right Column: Settings Tabs */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="personal" className="w-full h-full">
                            <TabsList className="bg-muted/50 p-1 w-full justify-start rounded-xl mb-6">
                                <TabsTrigger value="personal" className="px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                    Personal Info
                                </TabsTrigger>
                                <TabsTrigger value="school" className="px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                    School Details
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                                    Notifications
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="mt-0 focus-visible:outline-none">
                                <Card className={`${theme.radius.lg} border-border/50 bg-card shadow-sm`}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Personal Information</CardTitle>
                                        <CardDescription>Update your basic profile details and contact information.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="first-name">First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="first-name" defaultValue="Aishwarya" className="pl-10 h-10" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="last-name">Last Name</Label>
                                                <Input id="last-name" defaultValue="K" className="h-10" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input id="email" type="email" defaultValue="k.aishwarya@hillridge.edu.in" className="pl-10 h-10" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="phone" defaultValue="+91 98765 43210" className="pl-10 h-10" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Campus Location</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="location" defaultValue="Main Campus, Bangalore" className="pl-10 h-10" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-4 flex justify-end gap-3">
                                        <Button variant="outline">Cancel</Button>
                                        <Button>Save Changes</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="school" className="mt-0 focus-visible:outline-none">
                                <Card className={`${theme.radius.lg} border-border/50 bg-card shadow-sm`}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">School & Academic Details</CardTitle>
                                        <CardDescription>Your professional positioning within The Hillridge International School.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="department">Department</Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="department" defaultValue="Languages & Humanities" className="pl-10 h-10" readOnly />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="designation">Designation</Label>
                                                <Input id="designation" defaultValue="Head Facilitator" className="h-10" readOnly />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="academic-year">Primary Program</Label>
                                                <Input id="academic-year" defaultValue="Middle Years Programme (MYP)" className="h-10" readOnly />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="joining-date">Joining Date</Label>
                                                <Input id="joining-date" defaultValue="August 12, 2019" className="h-10" readOnly />
                                            </div>
                                        </div>

                                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Note</h4>
                                            <p className="text-xs text-muted-foreground">School details are managed by the Administrator. If you notice any discrepancy, please contact the IT Helpdesk.</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-4 flex justify-start">
                                        <Button variant="outline" className="text-xs h-8">Contact Admin</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
                                <Card className={`${theme.radius.lg} border-border/50 bg-card shadow-sm`}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Notification Preferences</CardTitle>
                                        <CardDescription>Configure how and when you want to be notified.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            { title: "Curriculum Updates", desc: "When a syllabus or curriculum framework is updated.", icon: <Bell className="w-4 h-4" /> },
                                            { title: "Planner Deadlines", desc: "Reminders for upcoming weekly or unit plan submissions.", icon: <Clock className="w-4 h-4" /> },
                                            { title: "AI Generation Ready", desc: "When your requested AI suggestions are processed.", icon: <Sparkles className="w-4 h-4 text-primary" /> },
                                            { title: "System Announcements", desc: "Important updates regarding the planner platform.", icon: <Info className="w-4 h-4" /> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                                <div className="flex gap-4">
                                                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold">{item.title}</h4>
                                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center h-8">
                                                    <div className="w-10 h-5 bg-primary rounded-full relative">
                                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-4 flex justify-end">
                                        <Button>Save Preferences</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Mock components used in the mapping above
const Sparkles = ({ className }: { className?: string }) => <div className={className}>✨</div>;
const Info = ({ className }: { className?: string }) => <div className={className}>ℹ️</div>;
const Clock = ({ className }: { className?: string }) => <div className={className}>🕒</div>;

export default Profile;
