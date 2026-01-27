export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Element */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      
      {children}

      {/* Background Image for context */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background opacity-[0.02] pointer-events-none"></div>
    </div>
  );
}
