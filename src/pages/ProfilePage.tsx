
import { useState, useEffect } from "react";
import { getCurrentUser, getUserDeliveries, logout, loginWithGoogle, isLoggedIn } from "@/lib/firebase";
import { Delivery } from "@/types/delivery";
import PageLayout from "@/components/PageLayout";
import DeliveryCard from "@/components/DeliveryCard";
import DeliveryDialog from "@/components/DeliveryDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, Package, UserPlus, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [createdDeliveries, setCreatedDeliveries] = useState<Delivery[]>([]);
  const [takenDeliveries, setTakenDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = isLoggedIn();
      if (loggedIn) {
        const userData = getCurrentUser();
        setUser(userData);
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserDeliveries();
    } else if (authChecked) {
      setLoading(false);
    }
  }, [user, authChecked]);

  const loadUserDeliveries = async () => {
    try {
      const { created, taken } = await getUserDeliveries();
      setCreatedDeliveries(created);
      setTakenDeliveries(taken);
    } catch (error) {
      console.error("Помилка завантаження доставок користувача:", error);
      toast.error("Не вдалося завантажити доставки");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      const userData = getCurrentUser();
      setUser(userData);
      toast.success("Вхід виконано успішно");
    } catch (error) {
      console.error("Помилка входу:", error);
      toast.error("Не вдалося увійти");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setCreatedDeliveries([]);
      setTakenDeliveries([]);
      toast.success("Вихід виконано успішно");
    } catch (error) {
      console.error("Помилка виходу:", error);
      toast.error("Не вдалося вийти");
    }
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <PageLayout title="Профіль">
        <div className="flex justify-center items-center pt-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout title="Профіль">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Ласкаво просимо до QuickDeliver</h2>
          <p className="mb-8 text-gray-600 max-w-sm">Увійдіть, щоб переглядати свої доставки та керувати профілем</p>
          <Button onClick={handleLogin} className="flex items-center gap-2 rounded-full">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Увійти через Google
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Calculate stats
  const completedDeliveries = takenDeliveries.filter(d => d.status === 'done').length;
  const ongoingDeliveries = takenDeliveries.filter(d => d.status === 'in-progress').length;
  const pendingDeliveries = createdDeliveries.filter(d => d.status === 'open').length;

  return (
    <PageLayout title="Профіль">
      <Card className="border-gray-100 card-shadow overflow-hidden mb-6">
        <div className="h-24 bg-gradient-delivery" />
        <CardContent className="p-0">
          <div className="flex flex-col items-center -mt-12 px-4 pb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback className="bg-primary text-white text-xl">
                {user.displayName?.[0] || user.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-3">{user.displayName}</h2>
            <p className="text-gray-600">{user.email}</p>
            
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="mt-4 flex items-center gap-1 rounded-full text-gray-700"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Вийти
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-white rounded-lg border border-gray-100 text-center card-shadow">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{pendingDeliveries}</div>
          <div className="text-sm text-gray-600">Очікують</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg border border-gray-100 text-center card-shadow">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{ongoingDeliveries}</div>
          <div className="text-sm text-gray-600">В процесі</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg border border-gray-100 text-center card-shadow">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedDeliveries}</div>
          <div className="text-sm text-gray-600">Виконано</div>
        </div>
      </div>

      <Tabs defaultValue="created" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Створені ({createdDeliveries.length})</TabsTrigger>
          <TabsTrigger value="taken">Прийняті ({takenDeliveries.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="mt-4">
          {createdDeliveries.length > 0 ? (
            createdDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800">Немає створених доставок</h3>
              <p className="text-gray-500 mt-2">У вас ще немає створених запитів на доставку.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="taken" className="mt-4">
          {takenDeliveries.length > 0 ? (
            takenDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800">Немає прийнятих доставок</h3>
              <p className="text-gray-500 mt-2">Ви ще не прийняли жодного запиту на доставку.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DeliveryDialog
        delivery={selectedDelivery}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        showAcceptButton={false}
      />
    </PageLayout>
  );
};

export default ProfilePage;
