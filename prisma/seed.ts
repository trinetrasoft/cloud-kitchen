import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

console.log("Connecting to:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@"));
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.kitchen.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const demoOwner1 = await prisma.user.create({
    data: {
      email: "priya@trinetra.com",
      firstName: "Priya",
      lastName: "Sharma",
      role: "KITCHEN_OWNER",
    },
  });

  const demoOwner2 = await prisma.user.create({
    data: {
      email: "raj@trinetra.com",
      firstName: "Raj",
      lastName: "Patel",
      role: "KITCHEN_OWNER",
    },
  });

  const demoOwner3 = await prisma.user.create({
    data: {
      email: "anita@trinetra.com",
      firstName: "Anita",
      lastName: "Reddy",
      role: "KITCHEN_OWNER",
    },
  });

  const demoOwner4 = await prisma.user.create({
    data: {
      email: "vikram@trinetra.com",
      firstName: "Vikram",
      lastName: "Singh",
      role: "KITCHEN_OWNER",
    },
  });

  const demoOwner5 = await prisma.user.create({
    data: {
      email: "meera@trinetra.com",
      firstName: "Meera",
      lastName: "Nair",
      role: "KITCHEN_OWNER",
    },
  });

  const demoOwner6 = await prisma.user.create({
    data: {
      email: "arjun@trinetra.com",
      firstName: "Arjun",
      lastName: "Gupta",
      role: "KITCHEN_OWNER",
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      email: "customer@trinetra.com",
      firstName: "Demo",
      lastName: "Customer",
      role: "CUSTOMER",
    },
  });

  // Create customer address
  await prisma.userAddress.create({
    data: {
      userId: demoCustomer.id,
      label: "Home",
      street: "123 Main Street, Apt 4B",
      city: "Jersey City",
      state: "NJ",
      zipCode: "07302",
      latitude: 40.7178,
      longitude: -74.0431,
      isDefault: true,
    },
  });

  // ========================
  // KITCHEN 1: Amma's Kitchen (South Indian)
  // ========================
  const kitchen1 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner1.id,
      name: "Amma's Kitchen",
      slug: "ammas-kitchen",
      description:
        "Authentic South Indian home cooking, just like Amma makes. Specializing in dosas, idlis, and traditional Tamil Nadu recipes.",
      story:
        "Started by Priya Sharma, who moved from Chennai to New Jersey in 2015. Missing the taste of her mother's cooking, she began making traditional South Indian dishes for friends and family. Word spread quickly, and Amma's Kitchen was born.",
      cuisineTypes: JSON.stringify(["south_indian", "tamil"]),
      regionTags: JSON.stringify(["tamil", "kerala", "south_indian"]),
      street: "456 Oak Avenue",
      city: "Edison",
      state: "NJ",
      zipCode: "08817",
      latitude: 40.5187,
      longitude: -74.4121,
      phone: "+1-732-555-0101",
      email: "priya@ammas-kitchen.com",
      imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800",
      verificationStatus: "CERTIFIED",
      hygieneScore: "A",
      isActive: true,
      commissionRate: 12.0,
      avgPrepTimeMinutes: 25,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen1.id,
        name: "Masala Dosa",
        slug: "masala-dosa",
        description: "Crispy rice crepe filled with spiced potato masala, served with coconut chutney and sambar",
        category: "main",
        price: 12.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 1",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["rice", "urad dal", "potato", "onion", "spices"]),
        allergens: JSON.stringify([]),
        imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen1.id,
        name: "Idli Sambar",
        slug: "idli-sambar",
        description: "Soft steamed rice cakes served with lentil sambar and fresh coconut chutney",
        category: "main",
        price: 9.99,
        preparationTimeMinutes: 15,
        servingSize: "4 pieces",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["rice", "urad dal", "lentils", "vegetables"]),
        allergens: JSON.stringify([]),
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400",
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen1.id,
        name: "Medu Vada",
        slug: "medu-vada",
        description: "Crispy golden lentil donuts, perfectly spiced and served with chutneys",
        category: "appetizer",
        price: 7.99,
        preparationTimeMinutes: 15,
        servingSize: "3 pieces",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["urad dal", "curry leaves", "ginger", "green chili"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen1.id,
        name: "Chettinad Chicken Curry",
        slug: "chettinad-chicken",
        description: "Fiery and aromatic chicken curry from the Chettinad region with freshly ground spices",
        category: "main",
        price: 16.99,
        preparationTimeMinutes: 30,
        servingSize: "Serves 2",
        spiceLevel: 4,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["chicken", "coconut", "spices", "curry leaves"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 3,
      },
      {
        kitchenId: kitchen1.id,
        name: "Filter Coffee",
        slug: "filter-coffee",
        description: "Traditional South Indian filter coffee with chicory, served frothy and hot",
        category: "beverage",
        price: 4.99,
        preparationTimeMinutes: 5,
        servingSize: "1 cup",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["coffee", "chicory", "milk", "sugar"]),
        allergens: JSON.stringify(["dairy"]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen1.id,
        name: "Payasam",
        slug: "payasam",
        description: "Rich vermicelli kheer made with milk, sugar, cardamom, and nuts",
        category: "dessert",
        price: 6.99,
        preparationTimeMinutes: 10,
        servingSize: "1 bowl",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["vermicelli", "milk", "sugar", "cardamom", "cashews", "raisins"]),
        allergens: JSON.stringify(["dairy", "gluten", "nuts"]),
        isAvailable: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // KITCHEN 2: Punjab Da Dhaba (North Indian)
  // ========================
  const kitchen2 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner2.id,
      name: "Punjab Da Dhaba",
      slug: "punjab-da-dhaba",
      description:
        "Hearty Punjabi food with rich gravies, tandoori specialties, and fresh naan straight from our clay oven.",
      story:
        "Raj Patel grew up in a family of dhabawallas in Amritsar. After moving to the US, he recreated the authentic dhaba experience with recipes passed down through 3 generations.",
      cuisineTypes: JSON.stringify(["north_indian", "mughlai"]),
      regionTags: JSON.stringify(["punjabi", "north_indian", "mughlai"]),
      street: "789 Spice Lane",
      city: "Jersey City",
      state: "NJ",
      zipCode: "07302",
      latitude: 40.7178,
      longitude: -74.0431,
      phone: "+1-201-555-0202",
      email: "raj@punjabdadhaba.com",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      verificationStatus: "CERTIFIED",
      hygieneScore: "A",
      isActive: true,
      commissionRate: 15.0,
      avgPrepTimeMinutes: 35,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen2.id,
        name: "Butter Chicken",
        slug: "butter-chicken",
        description: "Tender chicken in a rich, creamy tomato sauce with butter and kasuri methi",
        category: "main",
        price: 17.99,
        preparationTimeMinutes: 30,
        servingSize: "Serves 2",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["chicken", "tomato", "butter", "cream", "spices"]),
        allergens: JSON.stringify(["dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen2.id,
        name: "Dal Makhani",
        slug: "dal-makhani",
        description: "Slow-cooked black lentils in a buttery, creamy gravy. Our signature dish.",
        category: "main",
        price: 14.99,
        preparationTimeMinutes: 25,
        servingSize: "Serves 2",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["black lentils", "butter", "cream", "tomato", "spices"]),
        allergens: JSON.stringify(["dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen2.id,
        name: "Garlic Naan",
        slug: "garlic-naan",
        description: "Soft tandoori bread brushed with garlic butter, baked in clay oven",
        category: "bread",
        price: 3.99,
        preparationTimeMinutes: 10,
        servingSize: "2 pieces",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["flour", "garlic", "butter", "yogurt"]),
        allergens: JSON.stringify(["gluten", "dairy"]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen2.id,
        name: "Paneer Tikka",
        slug: "paneer-tikka",
        description: "Marinated cottage cheese cubes grilled with bell peppers and onions",
        category: "appetizer",
        price: 13.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 2",
        spiceLevel: 3,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["paneer", "yogurt", "spices", "bell peppers"]),
        allergens: JSON.stringify(["dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen2.id,
        name: "Chicken Biryani",
        slug: "chicken-biryani",
        description: "Fragrant basmati rice layered with spiced chicken, saffron, and fried onions",
        category: "rice",
        price: 18.99,
        preparationTimeMinutes: 40,
        servingSize: "Serves 2",
        spiceLevel: 3,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["basmati rice", "chicken", "saffron", "spices", "onions"]),
        allergens: JSON.stringify([]),
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen2.id,
        name: "Gulab Jamun",
        slug: "gulab-jamun",
        description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup",
        category: "dessert",
        price: 6.99,
        preparationTimeMinutes: 5,
        servingSize: "4 pieces",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["khoya", "flour", "sugar", "rose water", "cardamom"]),
        allergens: JSON.stringify(["dairy", "gluten"]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen2.id,
        name: "Mango Lassi",
        slug: "mango-lassi",
        description: "Creamy yogurt drink blended with sweet Alphonso mango pulp",
        category: "beverage",
        price: 5.99,
        preparationTimeMinutes: 5,
        servingSize: "16 oz",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["yogurt", "mango", "sugar", "cardamom"]),
        allergens: JSON.stringify(["dairy"]),
        isAvailable: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // KITCHEN 3: Andhra Spice Box (Andhra / Telangana)
  // ========================
  const kitchen3 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner3.id,
      name: "Andhra Spice Box",
      slug: "andhra-spice-box",
      description:
        "Bold and fiery Andhra cuisine. Not for the faint-hearted! Our recipes bring the authentic heat of Andhra Pradesh.",
      story:
        "Anita Reddy, a software engineer turned chef, brings the explosive flavors of Hyderabad and Andhra to your plate. Every dish is made with hand-ground spice blends.",
      cuisineTypes: JSON.stringify(["south_indian", "andhra"]),
      regionTags: JSON.stringify(["andhra", "telangana", "hyderabadi"]),
      street: "321 Curry Road",
      city: "Iselin",
      state: "NJ",
      zipCode: "08830",
      latitude: 40.5721,
      longitude: -74.3224,
      phone: "+1-732-555-0303",
      email: "anita@andhraspicebox.com",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
      verificationStatus: "VERIFIED",
      hygieneScore: "A",
      isActive: true,
      commissionRate: 15.0,
      avgPrepTimeMinutes: 30,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen3.id,
        name: "Hyderabadi Dum Biryani",
        slug: "hyderabadi-biryani",
        description: "Slow-cooked aromatic biryani with tender goat meat, saffron rice, and traditional Hyderabadi spices",
        category: "rice",
        price: 21.99,
        preparationTimeMinutes: 45,
        servingSize: "Serves 2-3",
        spiceLevel: 3,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["goat", "basmati rice", "saffron", "spices", "yogurt"]),
        allergens: JSON.stringify(["dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen3.id,
        name: "Gongura Chicken",
        slug: "gongura-chicken",
        description: "Tangy sorrel leaf chicken curry, a signature Andhra delicacy",
        category: "main",
        price: 16.99,
        preparationTimeMinutes: 30,
        servingSize: "Serves 2",
        spiceLevel: 4,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["chicken", "gongura leaves", "spices", "onions"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen3.id,
        name: "Mirchi Bajji",
        slug: "mirchi-bajji",
        description: "Large green chilies stuffed with tangy masala, dipped in gram flour batter and deep fried",
        category: "appetizer",
        price: 8.99,
        preparationTimeMinutes: 15,
        servingSize: "4 pieces",
        spiceLevel: 5,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["green chilies", "gram flour", "spices"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen3.id,
        name: "Pesarattu",
        slug: "pesarattu",
        description: "Green moong dal dosa, a protein-rich Andhra specialty served with ginger chutney",
        category: "main",
        price: 11.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 1",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["green moong dal", "rice", "ginger", "green chili"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen3.id,
        name: "Double Ka Meetha",
        slug: "double-ka-meetha",
        description: "Hyderabadi bread pudding with saffron, cardamom, and nuts",
        category: "dessert",
        price: 7.99,
        preparationTimeMinutes: 10,
        servingSize: "1 serving",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["bread", "milk", "sugar", "saffron", "cardamom", "nuts"]),
        allergens: JSON.stringify(["dairy", "gluten", "nuts"]),
        isAvailable: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // KITCHEN 4: Rajasthani Royal Thali
  // ========================
  const kitchen4 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner4.id,
      name: "Rajasthani Royal Thali",
      slug: "rajasthani-royal-thali",
      description:
        "Experience the royal cuisine of Rajasthan. Complete thalis with dal-baati-churma, gate ki sabzi, and more.",
      story:
        "Vikram Singh brings the majestic flavors of Jodhpur's kitchens to your dining table. Every dish is crafted with love and tradition.",
      cuisineTypes: JSON.stringify(["north_indian", "rajasthani"]),
      regionTags: JSON.stringify(["rajasthani", "marwari"]),
      street: "555 Desert Drive",
      city: "Princeton",
      state: "NJ",
      zipCode: "08540",
      latitude: 40.3573,
      longitude: -74.6672,
      phone: "+1-609-555-0404",
      email: "vikram@rajasthani-thali.com",
      imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800",
      verificationStatus: "VERIFIED",
      hygieneScore: "B",
      isActive: true,
      commissionRate: 15.0,
      avgPrepTimeMinutes: 40,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen4.id,
        name: "Dal Baati Churma",
        slug: "dal-baati-churma",
        description: "Classic Rajasthani trio: baked wheat balls, five-lentil dal, and sweet churma",
        category: "main",
        price: 19.99,
        preparationTimeMinutes: 40,
        servingSize: "Serves 2",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["wheat flour", "ghee", "lentils", "jaggery"]),
        allergens: JSON.stringify(["gluten", "dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen4.id,
        name: "Laal Maas",
        slug: "laal-maas",
        description: "Fiery red mutton curry cooked with mathania chilies and yogurt",
        category: "main",
        price: 22.99,
        preparationTimeMinutes: 45,
        servingSize: "Serves 2",
        spiceLevel: 5,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["mutton", "mathania chili", "yogurt", "ghee"]),
        allergens: JSON.stringify(["dairy"]),
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen4.id,
        name: "Ker Sangri",
        slug: "ker-sangri",
        description: "Desert beans and berries cooked with traditional Rajasthani spices",
        category: "side",
        price: 10.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 2",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["ker berries", "sangri beans", "dried chili", "mustard oil"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen4.id,
        name: "Ghevar",
        slug: "ghevar",
        description: "Traditional Rajasthani honeycomb dessert topped with rabri and nuts",
        category: "dessert",
        price: 8.99,
        preparationTimeMinutes: 10,
        servingSize: "1 piece",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["flour", "ghee", "sugar", "rabri", "pistachios"]),
        allergens: JSON.stringify(["gluten", "dairy", "nuts"]),
        isAvailable: true,
        isSeasonalSpecial: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // KITCHEN 5: Kerala Kairali
  // ========================
  const kitchen5 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner5.id,
      name: "Kerala Kairali",
      slug: "kerala-kairali",
      description:
        "God's Own Kitchen - authentic Kerala cuisine with fresh coconut, curry leaves, and traditional spices.",
      story:
        "Meera Nair brings the flavors of her grandmother's kitchen in Kottayam to the US. Every dish uses freshly grated coconut and hand-picked curry leaves.",
      cuisineTypes: JSON.stringify(["south_indian", "kerala"]),
      regionTags: JSON.stringify(["kerala", "malabar"]),
      street: "888 Coconut Lane",
      city: "Edison",
      state: "NJ",
      zipCode: "08820",
      latitude: 40.5187,
      longitude: -74.4121,
      phone: "+1-732-555-0505",
      email: "meera@keralakairali.com",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800",
      verificationStatus: "CERTIFIED",
      hygieneScore: "A",
      isActive: true,
      commissionRate: 12.0,
      avgPrepTimeMinutes: 30,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen5.id,
        name: "Kerala Fish Curry",
        slug: "kerala-fish-curry",
        description: "Tangy and spicy fish curry cooked in clay pot with kokum and coconut milk",
        category: "main",
        price: 18.99,
        preparationTimeMinutes: 25,
        servingSize: "Serves 2",
        spiceLevel: 3,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["fish", "coconut milk", "kokum", "curry leaves", "spices"]),
        allergens: JSON.stringify(["fish"]),
        imageUrl: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen5.id,
        name: "Appam with Stew",
        slug: "appam-stew",
        description: "Lacey rice pancakes served with coconut milk vegetable stew",
        category: "main",
        price: 14.99,
        preparationTimeMinutes: 25,
        servingSize: "3 appams + stew",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["rice flour", "coconut milk", "vegetables", "spices"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen5.id,
        name: "Kerala Prawn Fry",
        slug: "kerala-prawn-fry",
        description: "Crispy fried prawns marinated with Kerala spices and curry leaves",
        category: "appetizer",
        price: 15.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 2",
        spiceLevel: 3,
        dietaryTags: JSON.stringify(["gluten_free"]),
        ingredients: JSON.stringify(["prawns", "curry leaves", "spices", "coconut oil"]),
        allergens: JSON.stringify(["shellfish"]),
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen5.id,
        name: "Puttu & Kadala Curry",
        slug: "puttu-kadala",
        description: "Steamed rice rolls with grated coconut, served with chickpea curry",
        category: "main",
        price: 12.99,
        preparationTimeMinutes: 20,
        servingSize: "Serves 1",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["rice flour", "coconut", "chickpeas", "spices"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 3,
      },
      {
        kitchenId: kitchen5.id,
        name: "Ada Pradhaman",
        slug: "ada-pradhaman",
        description: "Traditional Kerala payasam with rice flakes, jaggery, and coconut milk",
        category: "dessert",
        price: 7.99,
        preparationTimeMinutes: 10,
        servingSize: "1 bowl",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["rice flakes", "jaggery", "coconut milk", "cardamom"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // KITCHEN 6: Gujarati Ghar (Gujarati)
  // ========================
  const kitchen6 = await prisma.kitchen.create({
    data: {
      ownerId: demoOwner6.id,
      name: "Gujarati Ghar",
      slug: "gujarati-ghar",
      description:
        "Pure vegetarian Gujarati home food. Famous for our thali, dhokla, and undhiyu.",
      story:
        "Arjun Gupta's family has been making traditional Gujarati food for decades. Every dish captures the sweet-savory balance that defines Gujarati cuisine.",
      cuisineTypes: JSON.stringify(["gujarati", "north_indian"]),
      regionTags: JSON.stringify(["gujarati", "jain"]),
      street: "999 Vegetable Way",
      city: "Parsippany",
      state: "NJ",
      zipCode: "07054",
      latitude: 40.8581,
      longitude: -74.4259,
      phone: "+1-973-555-0606",
      email: "arjun@gujaratighar.com",
      imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800",
      verificationStatus: "VERIFIED",
      hygieneScore: "A",
      isActive: true,
      commissionRate: 15.0,
      avgPrepTimeMinutes: 25,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        kitchenId: kitchen6.id,
        name: "Gujarati Thali",
        slug: "gujarati-thali",
        description: "Complete Gujarati meal with dal, shaak, roti, rice, kadhi, papad, and pickle",
        category: "main",
        price: 22.99,
        preparationTimeMinutes: 30,
        servingSize: "Serves 1",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg", "jain"]),
        ingredients: JSON.stringify(["lentils", "vegetables", "wheat flour", "rice", "yogurt"]),
        allergens: JSON.stringify(["gluten", "dairy"]),
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen6.id,
        name: "Dhokla",
        slug: "dhokla",
        description: "Steamed savory chickpea flour cake topped with mustard seed tadka",
        category: "appetizer",
        price: 8.99,
        preparationTimeMinutes: 15,
        servingSize: "6 pieces",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg", "jain", "gluten_free"]),
        ingredients: JSON.stringify(["chickpea flour", "mustard seeds", "curry leaves"]),
        allergens: JSON.stringify([]),
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        isAvailable: true,
        displayOrder: 1,
      },
      {
        kitchenId: kitchen6.id,
        name: "Undhiyu",
        slug: "undhiyu",
        description: "Winter special mixed vegetable casserole with fenugreek dumplings",
        category: "main",
        price: 16.99,
        preparationTimeMinutes: 35,
        servingSize: "Serves 2",
        spiceLevel: 2,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["mixed vegetables", "fenugreek dumplings", "coconut", "spices"]),
        allergens: JSON.stringify([]),
        isAvailable: true,
        isSeasonalSpecial: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen6.id,
        name: "Khandvi",
        slug: "khandvi",
        description: "Delicate rolled savory snack made from gram flour and buttermilk",
        category: "appetizer",
        price: 9.99,
        preparationTimeMinutes: 15,
        servingSize: "8 rolls",
        spiceLevel: 1,
        dietaryTags: JSON.stringify(["veg", "gluten_free"]),
        ingredients: JSON.stringify(["gram flour", "buttermilk", "mustard seeds", "coconut"]),
        allergens: JSON.stringify(["dairy"]),
        isAvailable: true,
        displayOrder: 2,
      },
      {
        kitchenId: kitchen6.id,
        name: "Shrikhand",
        slug: "shrikhand",
        description: "Creamy sweetened strained yogurt flavored with saffron and cardamom",
        category: "dessert",
        price: 6.99,
        preparationTimeMinutes: 5,
        servingSize: "1 bowl",
        spiceLevel: 0,
        dietaryTags: JSON.stringify(["veg"]),
        ingredients: JSON.stringify(["yogurt", "sugar", "saffron", "cardamom", "pistachios"]),
        allergens: JSON.stringify(["dairy", "nuts"]),
        isAvailable: true,
        displayOrder: 1,
      },
    ],
  });

  // ========================
  // CREATE REVIEWS
  // ========================
  const kitchens = [kitchen1, kitchen2, kitchen3, kitchen4, kitchen5, kitchen6];
  const reviewTexts = [
    "Absolutely amazing! Tastes just like home cooking. Will order again!",
    "Great flavors and generous portions. The spice level was perfect.",
    "Loved the authenticity. Reminded me of my grandmother's cooking.",
    "Fresh ingredients and well-packed delivery. Highly recommended!",
    "Good food overall. Delivery was a bit late but the taste made up for it.",
    "Best Indian food I've had in the US. The biryani was outstanding!",
    "Excellent value for money. The thali was very satisfying.",
    "Wonderful flavors. Every dish was well-balanced and delicious.",
  ];

  for (const kitchen of kitchens) {
    const numReviews = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          userId: demoCustomer.id,
          kitchenId: kitchen.id,
          orderId: `demo-order-${kitchen.id}-${i}`,
          overallRating: 3 + Math.floor(Math.random() * 3),
          tasteRating: 3 + Math.floor(Math.random() * 3),
          authenticityRating: 3 + Math.floor(Math.random() * 3),
          portionRating: 3 + Math.floor(Math.random() * 3),
          packagingRating: 3 + Math.floor(Math.random() * 3),
          reviewText: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
          isAuthentic: Math.random() > 0.2,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
  console.log(`Created ${kitchens.length} kitchens with menu items and reviews.`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
