/**
 * Centralized Theme Configuration
 * ================================
 * Import and use these design tokens for consistent styling across the app.
 * 
 * Usage:
 *   import { theme, cn } from '@/lib/theme';
 *   className={cn(theme.card.base, theme.spacing.padding.md)}
 */

// =====================
// SPACING
// =====================
export const spacing = {
    page: {
        padding: 'px-6 py-6',
        maxWidth: 'max-w-7xl mx-auto w-full',
    },
    section: {
        marginBottom: 'mb-6',
        gap: 'gap-4',
    },
    card: {
        padding: {
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        },
        gap: 'gap-3',
    },
    header: {
        titleSpacing: 'space-y-0.5',
    },
} as const;

// =====================
// TYPOGRAPHY
// =====================
export const typography = {
    pageTitle: 'text-2xl font-bold tracking-tight text-foreground',
    pageDescription: 'text-sm text-muted-foreground',
    sectionTitle: 'text-lg font-bold text-foreground',
    cardTitle: 'text-base font-bold',
    cardDescription: 'text-xs text-muted-foreground',
    label: 'text-[10px] font-bold uppercase tracking-widest text-muted-foreground',
    labelSm: 'text-[9px] font-bold uppercase tracking-widest text-muted-foreground',
    body: 'text-sm text-foreground',
    bodySm: 'text-xs text-foreground',
    bodyMuted: 'text-sm text-muted-foreground',
} as const;

// =====================
// BORDER RADIUS
// =====================
export const radius = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
} as const;

// =====================
// SHADOWS
// =====================
export const shadow = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
} as const;

// =====================
// CARDS
// =====================
export const card = {
    base: 'border-border/50 bg-card/50 overflow-hidden',
    interactive: 'hover:border-primary/30 hover:shadow-md transition-all',
    sizes: {
        sm: `${radius.md} ${shadow.sm}`,
        md: `${radius.lg} ${shadow.md}`,
        lg: `${radius.lg} ${shadow.lg}`,
    },
} as const;

// =====================
// BUTTONS
// =====================
export const button = {
    icon: {
        sm: 'w-7 h-7',
        md: 'w-8 h-8',
        lg: 'w-9 h-9',
    },
    iconInner: {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4',
    },
} as const;

// =====================
// STATUS COLORS
// =====================
export const status = {
    success: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        border: 'border-emerald-500/30',
    },
    warning: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        border: 'border-amber-500/30',
    },
    error: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600',
        border: 'border-rose-500/30',
    },
    info: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600',
        border: 'border-blue-500/30',
    },
    muted: {
        bg: 'bg-muted/30',
        text: 'text-muted-foreground',
        border: 'border-border',
    },
} as const;

// =====================
// CHART COLORS
// =====================
export const chartColors = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    muted: '#94a3b8',
    blue: '#3b82f6',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
} as const;

// =====================
// GRID LAYOUTS
// =====================
export const grid = {
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-2 md:grid-cols-4',
} as const;

// =====================
// ANIMATIONS
// =====================
export const animation = {
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
    scaleIn: 'animate-scale-in',
    pulse: 'animate-pulse',
    transition: 'transition-all duration-300',
} as const;

// =====================
// COMBINED THEME OBJECT
// =====================
export const theme = {
    spacing,
    typography,
    radius,
    shadow,
    card,
    button,
    status,
    chartColors,
    grid,
    animation,
} as const;

// =====================
// HELPER: Class Name Merger
// =====================
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// =====================
// HELPER: Get Status Classes
// =====================
export function getStatusClasses(planStatus?: 'draft' | 'published' | null) {
    switch (planStatus) {
        case 'published':
            return status.success;
        case 'draft':
            return status.warning;
        default:
            return status.muted;
    }
}

export default theme;
