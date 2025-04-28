
import { useState, useEffect } from "react";
import { getDeliveries, acceptDelivery, completeDelivery } from "@/lib/firebase";
import { Delivery } from "@/types/delivery";
import PageLayout from "@/components/PageLayout";
import DeliveryCard from "@/components/DeliveryCard";
import DeliveryDialog from "@/components/DeliveryDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, MapPin, Package } from "lucide-react";
import { toast } from "sonner";

const HomePage = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getDeliveries();
        setDeliveries(data);
        setFilteredDeliveries(data);
      } catch (error) {
        console.error("Помилка завантаження доставок:", error);
        toast.error("Не вдалося завантажити доставки");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    let filtered = deliveries;
    
    // Filter by area if not "all"
    if (selectedArea !== "all") {
      filtered = filtered.filter(
        delivery => delivery.from.includes(selectedArea) || delivery.to.includes(selectedArea)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        delivery =>
          delivery.title.toLowerCase().includes(term) ||
          delivery.from.toLowerCase().includes(term) ||
          delivery.to.toLowerCase().includes(term) ||
          delivery.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredDeliveries(filtered);
  }, [deliveries, searchTerm, selectedArea]);

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDialogOpen(true);
  };

  const handleAcceptDelivery = async (id: string) => {
    try {
      await acceptDelivery(id);
      
      // Update the local state after accepting
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(d =>
          d.id === id ? { ...d, status: "in-progress", takenBy: "currentUserId" } : d
        )
      );
      
      // Close dialog after successful acceptance
      setDialogOpen(false);
    } catch (error) {
      console.error("Помилка при прийнятті доставки:", error);
      toast.error("Не вдалося прийняти доставку");
    }
  };
  
  const handleCompleteDelivery = async (id: string) => {
    try {
      await completeDelivery(id);
      
      // Update the local state after completing
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(d =>
          d.id === id ? { ...d, status: "done" } : d
        )
      );
      
      toast.success("Доставку успішно завершено!");
      
    } catch (error) {
      console.error("Помилка при завершенні доставки:", error);
      toast.error("Не вдалося завершити доставку");
    }
  };

  // Extract unique areas for the filter dropdown
  const areas = [...new Set(deliveries.flatMap(d => [d.from, d.to]))];

  return (
    <PageLayout showLogo>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Доступні доставки</h1>
        <p className="text-gray-500">Знайдіть та виберіть доставку для виконання</p>
      </div>
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Пошук доставок..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="pl-10 bg-white">
              <SelectValue placeholder="Фільтр за районом" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Усі райони</SelectItem>
              {areas.map((area, index) => (
                <SelectItem key={index} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDeliveries.length > 0 ? (
        <div className="space-y-2">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard 
              key={delivery.id} 
              delivery={delivery} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">Доставки не знайдені</h3>
          <p className="text-gray-500 mt-2">Спробуйте змінити параметри пошуку</p>
        </div>
      )}

      <DeliveryDialog
        delivery={selectedDelivery}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAccept={handleAcceptDelivery}
        onComplete={handleCompleteDelivery}
      />
    </PageLayout>
  );
};

export default HomePage;
