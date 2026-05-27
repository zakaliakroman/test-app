export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            📝 Todo App
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tasks by category · max 5 per category
          </p>
        </header>

        {children}
      </div>
    </div>
  );
};
