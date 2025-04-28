
import { Truck } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center justify-center bg-gradient-delivery p-2 rounded-lg text-white">
        <Truck className="h-5 w-5" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="ml-2 font-bold text-lg text-primary">
          QuickDeliver
        </div>
      )}
    </div>
  );
};

export default Logo;
