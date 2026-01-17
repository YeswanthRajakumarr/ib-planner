import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ClassList from "./pages/ClassList";
import CreatePlan from "./pages/CreatePlan";
import MonthlyPlanner from "./pages/MonthlyPlanner";
import Report from "./pages/Report";
import Curriculum from "./pages/Curriculum";
import Analytics from "./pages/Analytics";
import AcademicCalendar from "./pages/AcademicCalendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/planner" element={<MonthlyPlanner />} />
          <Route path="/report" element={<Report />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
