
import { MapPinIcon, CalendarIcon, PackageIcon, UserIcon, ArrowRight, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Delivery } from "@/types/delivery";
import { useState } from "react";
import { toast } from "sonner";

interface DeliveryDialogProps {
  delivery: Delivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
  showAcceptButton?: boolean;
}

const DeliveryDialog = ({
  delivery,
  open,
  onOpenChange,
  onAccept,
  onComplete,
  showAcceptButton = true,
}: DeliveryDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [completingDelivery, setCompletingDelivery] = useState(false);

  if (!delivery) {
    return null;
  }

  const handleAccept = async () => {
    if (!onAccept) return;
    
    setLoading(true);
    try {
      await onAccept(delivery.id);
      toast.success("Доставку успішно прийнято!");
      onOpenChange(false); // Close dialog after successful acceptance
    } catch (error) {
      console.error("Помилка при прийнятті доставки:", error);
      toast.error("Не вдалося прийняти доставку. Спробуйте знову.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!onComplete) return;
    
    setCompletingDelivery(true);
    try {
      await onComplete(delivery.id);
      toast.success("Доставку успішно завершено!");
      onOpenChange(false); // Close dialog after successful completion
    } catch (error) {
      console.error("Помилка при завершенні доставки:", error);
      toast.error("Не вдалося завершити доставку. Спробуйте знову.");
    } finally {
      setCompletingDelivery(false);
    }
  };

  const statusConfig = {
    "open": {
      text: "Відкрито",
      classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    "in-progress": {
      text: "В процесі",
      classes: "bg-blue-100 text-blue-800 border-blue-200",
    },
    "done": {
      text: "Виконано",
      classes: "bg-gray-100 text-gray-800 border-gray-200",
    }
  };

  const { text, classes } = statusConfig[delivery.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-delivery rounded-t-lg" />
        <DialogHeader className="pt-6">
          <DialogTitle className="text-xl font-bold">{delivery.title}</DialogTitle>
          <DialogDescription className="sr-only">Деталі доставки</DialogDescription>
          <div className="mt-1">
            <Badge variant="outline" className={classes}>
              {text}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <div className="min-w-0">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                {delivery.from}
              </div>
              <div className="mt-3 flex items-center text-sm font-medium">
                <MapPinIcon className="w-5 h-5 mr-2 text-accent" />
                {delivery.to}
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-2">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Дата і час</p>
                <p className="text-gray-600">{delivery.date} о {delivery.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <PackageIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Категорія</p>
                <p className="text-gray-600">{delivery.category}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-800">Деталі</p>
            <p className="text-gray-600 mt-1">{delivery.details || "Додаткові деталі не надано."}</p>
          </div>

          {delivery.createdBy && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Створено</p>
                <p className="text-gray-600">{delivery.createdBy}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          {showAcceptButton && delivery.status === "open" && (
            <Button 
              onClick={handleAccept}
              disabled={loading}
              className="w-full sm:w-auto rounded-full"
            >
              {loading ? "Приймається..." : "Прийняти доставку"}
            </Button>
          )}
          {onComplete && delivery.status === "in-progress" && (
            <Button 
              onClick={handleComplete}
              disabled={completingDelivery}
              className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="mr-1" size={18} />
              {completingDelivery ? "Завершується..." : "Завершити доставку"}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-full"
          >
            Закрити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDialog;
