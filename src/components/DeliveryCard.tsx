
import { CalendarIcon, MapPinIcon, PackageIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Delivery } from "@/types/delivery";

interface DeliveryCardProps {
  delivery: Delivery;
  onViewDetails: (delivery: Delivery) => void;
}

const DeliveryCard = ({ delivery, onViewDetails }: DeliveryCardProps) => {
  const statusConfig = {
    "open": {
      text: "Відкрито",
      classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
      animation: "animate-pulse-light"
    },
    "in-progress": {
      text: "В процесі",
      classes: "bg-blue-100 text-blue-800 border-blue-200",
      animation: ""
    },
    "done": {
      text: "Виконано",
      classes: "bg-gray-100 text-gray-800 border-gray-200",
      animation: ""
    }
  };

  const { text, classes, animation } = statusConfig[delivery.status];

  const handleCardClick = () => {
    onViewDetails(delivery);
  };

  return (
    <Card className="mb-5 shadow-none border border-gray-100 card-shadow card-hover overflow-hidden animate-slide-in-bottom">
      <div className="h-1.5 w-full bg-gradient-delivery" />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{delivery.title}</h3>
          <Badge variant="outline" className={`${classes} ${animation}`}>
            {text}
          </Badge>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
            <div>
              <span className="text-gray-500">Звідки:</span> {delivery.from}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2 text-accent" />
            <div>
              <span className="text-gray-500">Куди:</span> {delivery.to}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              {delivery.date} о {delivery.time}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <PackageIcon className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <span className="text-gray-500">Категорія:</span> {delivery.category}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
        <Button
          onClick={handleCardClick}
          className="w-full sm:w-auto rounded-full"
        >
          {delivery.status === "open" ? "Прийняти доставку" : "Переглянути деталі"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryCard;
