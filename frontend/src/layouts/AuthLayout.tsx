interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
  {title}
</h1>

<p className="mt-2 text-lg font-semibold text-blue-600">
  Zenith Nexus AI
</p>  

          <p className="mt-2 text-slate-500">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;