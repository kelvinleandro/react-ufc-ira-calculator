import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UFCLogo from "/src/assets/ufc_logo.svg?react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold text-foreground transition-colors hover:text-primary"
        >
          <UFCLogo className="h-6 w-6" alt="UFC Logo" />
          Calculadora de IRA
        </Link>

        <Link to="/sobre">
          <Button variant="outline" className="gap-2 hover:cursor-pointer">
            <BookOpen className="h-4 w-4" />
            Sobre o IRA
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
