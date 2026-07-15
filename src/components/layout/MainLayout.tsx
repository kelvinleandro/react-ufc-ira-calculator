import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <Header />
      <main className="pt-16">{children}</main>
      <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t border-border">
        Feito por{" "}
        <a 
          href="https://github.com/kelvinleandro" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium text-primary hover:underline"
        >
          Kelvin Leandro
        </a>
      </footer>
    </div>
  );
};

export default MainLayout;
