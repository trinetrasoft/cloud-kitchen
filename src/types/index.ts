export interface CartItem {
  id: string;
  kitchenId: string;
  kitchenName: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export interface KitchenWithRating {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  story: string | null;
  cuisineTypes: string[];
  regionTags: string[];
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  imageUrl: string | null;
  verificationStatus: string;
  hygieneScore: string | null;
  isActive: boolean;
  avgPrepTimeMinutes: number;
  avgRating: number;
  reviewCount: number;
}

export interface MenuItemType {
  id: string;
  kitchenId: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  preparationTimeMinutes: number;
  servingSize: string | null;
  spiceLevel: number | null;
  dietaryTags: string[];
  ingredients: string[] | null;
  allergens: string[] | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isSeasonalSpecial: boolean;
  displayOrder: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  finalAmount: number;
  deliveryFee: number;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  createdAt: string;
  estimatedDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  items: OrderItemSummary[];
}

export interface OrderItemSummary {
  id: string;
  kitchenId: string;
  kitchenName: string;
  menuItemName: string;
  quantity: number;
  priceAtTime: number;
  status: string;
  specialInstructions: string | null;
}

export interface SubscriptionPlan {
  tier: "BASIC" | "FAMILY" | "PARTY_PRO";
  name: string;
  price: number;
  features: string[];
  discount: number;
  freeDelivery: boolean;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

export const CUISINE_TYPES = [
  { value: "north_indian", label: "North Indian" },
  { value: "south_indian", label: "South Indian" },
  { value: "bengali", label: "Bengali" },
  { value: "gujarati", label: "Gujarati" },
  { value: "rajasthani", label: "Rajasthani" },
  { value: "maharashtrian", label: "Maharashtrian" },
  { value: "kerala", label: "Kerala" },
  { value: "tamil", label: "Tamil" },
  { value: "andhra", label: "Andhra" },
  { value: "mughlai", label: "Mughlai" },
  { value: "street_food", label: "Street Food" },
  { value: "indo_chinese", label: "Indo-Chinese" },
] as const;

export const DIETARY_TAGS = [
  { value: "veg", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "nut_free", label: "Nut Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "halal", label: "Halal" },
] as const;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: "BASIC",
    name: "Basic",
    price: 9.99,
    discount: 15,
    freeDelivery: false,
    features: [
      "15% off all orders",
      "Early access to seasonal specials",
      "Priority customer support",
    ],
  },
  {
    tier: "FAMILY",
    name: "Family",
    price: 19.99,
    discount: 20,
    freeDelivery: true,
    features: [
      "20% off all orders",
      "Free delivery on orders $30+",
      "Family-size portions discount",
      "Weekly meal planning",
      "Priority customer support",
    ],
  },
  {
    tier: "PARTY_PRO",
    name: "Party Pro",
    price: 39.99,
    discount: 25,
    freeDelivery: true,
    features: [
      "25% off all orders",
      "Free delivery on all orders",
      "Dedicated party planner",
      "Custom catering menus",
      "Bulk order discounts",
      "Priority customer support",
    ],
  },
];
