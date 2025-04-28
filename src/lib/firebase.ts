
import { Delivery } from "@/types/delivery";

// Mock data for deliveries
const MOCK_DELIVERIES: Delivery[] = [
  {
    id: "1",
    title: "Доставити документи",
    from: "Шевченківський район",
    to: "Сихів",
    date: "2025-04-07",
    time: "16:30",
    category: "documents",
    details: "Доставити в конверті, не згинати",
    status: "open",
    createdBy: "user123",
    takenBy: null,
  },
  {
    id: "2",
    title: "Забрати продукти",
    from: "Сільпо Супермаркет",
    to: "Франківський район",
    date: "2025-04-08",
    time: "10:00",
    category: "shopping",
    details: "Купити товари зі списку покупок і доставити. Чек буде відшкодовано.",
    status: "open",
    createdBy: "user456",
    takenBy: null,
  },
  {
    id: "3",
    title: "Забрати посилку",
    from: "Нова Пошта #23",
    to: "Личаківський район",
    date: "2025-04-07",
    time: "12:45",
    category: "package",
    details: "Забрати посилку #12345678, потрібне посвідчення особи",
    status: "in-progress",
    createdBy: "user789",
    takenBy: "courier123",
  },
];

// Updated mock user data
const currentUser = {
  uid: "user123",
  email: "sichmax@gmail.com",
  displayName: "Max Sichkar",
  photoURL: "/lovable-uploads/bbff0953-5e2e-46ae-8c0c-1bc73d43dd0d.png",
};

// Get all deliveries
export const getDeliveries = async (): Promise<Delivery[]> => {
  return MOCK_DELIVERIES;
};

// Get delivery by ID
export const getDeliveryById = async (id: string): Promise<Delivery | null> => {
  const delivery = MOCK_DELIVERIES.find((d) => d.id === id);
  return delivery || null;
};

// Add a new delivery
export const addDelivery = async (delivery: Omit<Delivery, "id" | "status" | "createdBy" | "takenBy">): Promise<Delivery> => {
  const newDelivery: Delivery = {
    ...delivery,
    id: `${Date.now()}`,
    status: "open",
    createdBy: currentUser.uid,
    takenBy: null,
  };
  
  // In a real app, this would save to Firebase
  console.log("Adding new delivery:", newDelivery);
  
  // Add to mock data for demo purposes
  MOCK_DELIVERIES.push(newDelivery);
  
  return newDelivery;
};

// Accept a delivery
export const acceptDelivery = async (deliveryId: string): Promise<void> => {
  // In a real app, this would update the delivery in Firebase
  console.log(`Delivery ${deliveryId} accepted by user ${currentUser.uid}`);
  
  // Update in mock data for demo purposes
  const deliveryIndex = MOCK_DELIVERIES.findIndex(d => d.id === deliveryId);
  if (deliveryIndex >= 0) {
    MOCK_DELIVERIES[deliveryIndex] = {
      ...MOCK_DELIVERIES[deliveryIndex],
      status: "in-progress",
      takenBy: currentUser.uid
    };
  }
};

// Complete a delivery
export const completeDelivery = async (deliveryId: string): Promise<void> => {
  // In a real app, this would update the delivery in Firebase
  console.log(`Delivery ${deliveryId} completed by user ${currentUser.uid}`);
  
  // Update in mock data for demo purposes
  const deliveryIndex = MOCK_DELIVERIES.findIndex(d => d.id === deliveryId);
  if (deliveryIndex >= 0) {
    MOCK_DELIVERIES[deliveryIndex] = {
      ...MOCK_DELIVERIES[deliveryIndex],
      status: "done",
    };
  }
};

// Get user's deliveries (both created and taken)
export const getUserDeliveries = async (): Promise<{ created: Delivery[], taken: Delivery[] }> => {
  const created = MOCK_DELIVERIES.filter(d => d.createdBy === currentUser.uid);
  const taken = MOCK_DELIVERIES.filter(d => d.takenBy === currentUser.uid);
  return { created, taken };
};

// Auth functions (mock)
export const getCurrentUser = () => {
  return currentUser;
};

export const loginWithGoogle = async (): Promise<void> => {
  // Mock login function
  console.log("User logged in with Google");
};

export const logout = async (): Promise<void> => {
  // Mock logout function
  console.log("User logged out");
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return true; // Mock always logged in for now
};
