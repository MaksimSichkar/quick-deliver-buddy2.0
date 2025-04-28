
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to HomePage
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Index;
