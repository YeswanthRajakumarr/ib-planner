import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="p-6 space-y-4 rounded-2xl border border-border/50 bg-card/50">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
};

export const SkeletonAISuggestion = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-primary/20 animate-pulse" />
        <Skeleton className="h-4 w-32" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2 animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
};
