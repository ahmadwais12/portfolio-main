import { Skeleton } from "@/components/ui/skeleton";

// ─── Hero Skeleton ────────────────────────────────────────────────────────────
export const HeroSkeleton = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        {/* Image */}
        <div className="order-2 md:order-1 flex justify-center">
          <Skeleton className="w-80 h-80 rounded-full" />
        </div>
        {/* Text */}
        <div className="order-1 md:order-2 space-y-5">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
          <div className="flex gap-3 pt-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-14 h-14 rounded-full" />)}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── About Skeleton ───────────────────────────────────────────────────────────
export const AboutSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <Skeleton className="w-full aspect-square max-w-md mx-auto rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Skills Skeleton ──────────────────────────────────────────────────────────
export const SkillsSkeleton = () => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-10 w-48 mx-auto rounded-full" />
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <div className="flex justify-center gap-4 mb-14 flex-wrap">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-40 rounded-2xl" />)}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-7 w-20 rounded-xl" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Projects Skeleton ────────────────────────────────────────────────────────
export const ProjectsSkeleton = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-14 w-72 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <div className="flex justify-center mb-12">
        <Skeleton className="h-12 w-80 rounded-2xl" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden border border-border/50">
            <Skeleton className="w-full aspect-video" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-1.5 flex-wrap pt-1">
                {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-6 w-16 rounded-full" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Resume Skeleton ──────────────────────────────────────────────────────────
export const ResumeSkeleton = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-12 w-72 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
        <Skeleton className="h-11 w-44 mx-auto rounded-xl mt-4" />
      </div>
      <div className="max-w-4xl mx-auto space-y-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative pl-20">
            <Skeleton className="absolute left-4 -translate-x-1/2 w-10 h-10 rounded-full" />
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Services Skeleton ────────────────────────────────────────────────────────
export const ServicesSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-12 w-56 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Testimonials Skeleton ────────────────────────────────────────────────────
export const TestimonialsSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-12 w-72 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Contact Skeleton ─────────────────────────────────────────────────────────
export const ContactSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-3">
        <Skeleton className="h-12 w-56 mx-auto" />
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          <div className="flex gap-3 pt-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-12 h-12 rounded-xl" />)}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Dashboard Home Skeleton ──────────────────────────────────────────────────
export const DashboardHomeSkeleton = () => (
  <div className="space-y-8 max-w-7xl mx-auto">
    <Skeleton className="h-36 w-full rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-10 w-full rounded-xl" />)}
        </div>
      ))}
    </div>
  </div>
);

// ─── Projects Manager Skeleton ────────────────────────────────────────────────
export const ProjectsManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    <Skeleton className="h-10 w-72 rounded-xl" />
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1 max-w-md rounded-xl" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-6 w-16 rounded-full" />)}
            </div>
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 flex-1 rounded-lg" />
              <Skeleton className="h-8 w-10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Skills Manager Skeleton ──────────────────────────────────────────────────
export const SkillsManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-64 rounded-xl" />
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="glass-card rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex gap-1">
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <Skeleton className="w-7 h-7 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Testimonials Manager Skeleton ────────────────────────────────────────────
export const TestimonialsManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
    <Skeleton className="h-10 w-64 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Skeleton key={j} className="w-4 h-4 rounded" />)}
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Services Manager Skeleton ────────────────────────────────────────────────
export const ServicesManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    <Skeleton className="h-10 w-64 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-1.5 flex-wrap pt-1">
                {[...Array(3)].map((_, j) => <Skeleton key={j} className="h-6 w-20 rounded-full" />)}
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Profile Manager Skeleton ─────────────────────────────────────────────────
export const ProfileManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Settings Manager Skeleton ────────────────────────────────────────────────
export const SettingsManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-56" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="flex justify-end">
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  </div>
);

// ─── About Manager Skeleton ───────────────────────────────────────────────────
export const AboutManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="space-y-2">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-20" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Resume Manager Skeleton ──────────────────────────────────────────────────
export const ResumeManagerSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
    <div className="relative pl-20 space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative">
          <Skeleton className="absolute left-[-52px] w-10 h-10 rounded-full" />
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Login Skeleton ─────────────────────────────────────────────────────
export const AdminLoginSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
