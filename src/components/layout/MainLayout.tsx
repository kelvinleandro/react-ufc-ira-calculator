import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default MainLayout;
