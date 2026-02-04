export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f5f6] dark:bg-[#221016]">
      {/* Decorative Background Elements */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#f20d59]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f20d59]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] left-[15%] w-[200px] h-[200px] bg-[#f20d59]/10 rounded-full blur-[80px] opacity-60 dark:opacity-10 pointer-events-none"></div>

      {children}
    </div>
  );
}
