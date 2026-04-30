export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center">
      {children}
    </div>
  );
}
