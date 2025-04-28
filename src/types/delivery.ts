
export interface Delivery {
  id: string;
  title: string;
  from: string;
  to: string;
  date: string;
  time: string;
  category: string;
  details: string;
  status: "open" | "in-progress" | "done";
  createdBy: string | null;
  takenBy: string | null;
}
