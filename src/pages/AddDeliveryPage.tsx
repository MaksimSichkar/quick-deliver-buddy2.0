
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, MapPinIcon, PackageIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import { cn } from "@/lib/utils";
import { addDelivery } from "@/lib/firebase";
import { scheduleNotification } from "@/lib/notifications";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, { message: "Назва повинна містити щонайменше 3 символи" }).max(100),
  from: z.string().min(3, { message: "Місце відправлення обов'язкове" }),
  to: z.string().min(3, { message: "Місце призначення обов'язкове" }),
  date: z.date({ required_error: "Дата обов'язкова" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Час повинен бути у форматі ГГ:ХХ" }),
  category: z.string({ required_error: "Будь ласка, оберіть категорію" }),
  details: z.string().max(500).optional(),
});

const CATEGORIES = [
  { value: "documents", label: "Документи" },
  { value: "food", label: "Їжа" },
  { value: "shopping", label: "Покупки" },
  { value: "package", label: "Посилка" },
  { value: "other", label: "Інше" },
];

const AddDeliveryPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      from: "",
      to: "",
      time: "",
      details: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const formattedDate = format(values.date, "yyyy-MM-dd");
      
      await addDelivery({
        title: values.title,
        from: values.from,
        to: values.to,
        date: formattedDate,
        time: values.time,
        category: values.category,
        details: values.details || "",
      });
      
      // Schedule notification
      const [hours, minutes] = values.time.split(":").map(Number);
      const notificationTime = new Date(values.date);
      notificationTime.setHours(hours, minutes, 0);
      
      // Schedule notification 30 minutes before delivery time
      const reminderTime = new Date(notificationTime.getTime() - 30 * 60 * 1000);
      await scheduleNotification(
        "Нагадування про доставку",
        `Ваша доставка "${values.title}" запланована через 30 хвилин.`,
        reminderTime
      );
      
      toast.success("Запит на доставку успішно додано!");
      navigate("/");
    } catch (error) {
      console.error("Помилка при додаванні доставки:", error);
      toast.error("Не вдалося додати запит на доставку. Спробуйте знову.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="Додати запит">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Створення доставки</h1>
        <p className="text-gray-500">Заповніть деталі для створення нового запиту на доставку</p>
      </div>

      <Card className="border-gray-100 card-shadow">
        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Назва доставки</FormLabel>
                    <FormControl>
                      <Input placeholder="наприклад, Доставити документи в офіс" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-700">Маршрут</h3>
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Звідки</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-primary" />
                          <Input placeholder="Місце відправлення" className="pl-10 bg-white" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Куди</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-accent" />
                          <Input placeholder="Місце призначення" className="pl-10 bg-white" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-700">Час доставки</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-700">Дата</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal bg-white",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Оберіть дату</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Час</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="time"
                              className="pl-10 bg-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Категорія</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              <PackageIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Деталі</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Додаткова інформація про доставку..."
                        className="resize-none bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
                      Будь-які спеціальні інструкції або деталі щодо доставки.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-full" disabled={submitting}>
                {submitting ? "Створення..." : "Створити запит на доставку"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AddDeliveryPage;
