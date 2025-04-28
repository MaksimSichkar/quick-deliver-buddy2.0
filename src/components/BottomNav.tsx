
import { Home, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex justify-around items-center px-4 z-10 bottom-nav-shadow safe-bottom">
      <NavItem 
        to="/"
        label="Головна" 
        icon={<Home size={22} />} 
        isActive={path === "/"} 
      />
      
      <NavItem 
        to="/add-delivery"
        label="Додати" 
        icon={<Plus size={22} />} 
        isActive={path === "/add-delivery"}
        isPrimary
      />
      
      <NavItem 
        to="/profile"
        label="Профіль" 
        icon={<User size={22} />} 
        isActive={path === "/profile"} 
      />
    </div>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isPrimary?: boolean;
}

const NavItem = ({ to, label, icon, isActive, isPrimary }: NavItemProps) => {
  if (isPrimary) {
    return (
      <Link to={to} className="relative -mt-5">
        <div className={`flex flex-col items-center`}>
          <div className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg ${isActive ? 'bg-accent' : ''}`}>
            {icon}
          </div>
          <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>{label}</span>
        </div>
      </Link>
    );
  }
  
  return (
    <Link to={to} className={`flex flex-col items-center justify-center`}>
      <div className={`p-2 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>{label}</span>
    </Link>
  );
};

export default BottomNav;
