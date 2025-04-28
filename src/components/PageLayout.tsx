
import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import Logo from "./Logo";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showLogo?: boolean;
}

const PageLayout = ({ children, title, showLogo = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4 header-shadow flex items-center justify-center">
        {showLogo ? (
          <Logo />
        ) : (
          <h1 className="text-xl font-semibold text-center">{title}</h1>
        )}
      </header>
      <main className="p-4 max-w-3xl mx-auto animate-fade-in">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default PageLayout;
