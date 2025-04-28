
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PackageX } from "lucide-react";
import Logo from "@/components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg card-shadow animate-fade-in">
        <Logo className="mx-auto mb-8" />
        <PackageX className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Схоже, ця доставка загубилась по дорозі
        </p>
        <Button onClick={() => navigate("/")} className="w-full max-w-xs rounded-full">
          Повернутися на головну
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
