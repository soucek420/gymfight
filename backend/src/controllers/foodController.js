// backend/src/controllers/foodController.js

const Food = require('../models/food');

// Hardcoded food data - 100 foods with complete macronutrients
const HARDCODED_FOODS = [
  // PROTEINS
  {
    _id: "food_001",
    name: "Chicken Breast (skinless)",
    calories_per_100g: 165,
    proteins_per_100g: 31,
    carbohydrates_per_100g: 0,
    fats_per_100g: 3.6,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_002",
    name: "Salmon (Atlantic)",
    calories_per_100g: 208,
    proteins_per_100g: 25,
    carbohydrates_per_100g: 0,
    fats_per_100g: 12,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_003",
    name: "Eggs (whole)",
    calories_per_100g: 155,
    proteins_per_100g: 13,
    carbohydrates_per_100g: 1.1,
    fats_per_100g: 11,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_004",
    name: "Tofu (firm)",
    calories_per_100g: 144,
    proteins_per_100g: 17,
    carbohydrates_per_100g: 3,
    fats_per_100g: 9,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_005",
    name: "Lean Ground Beef (90% lean)",
    calories_per_100g: 176,
    proteins_per_100g: 26,
    carbohydrates_per_100g: 0,
    fats_per_100g: 8,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_006",
    name: "Tuna (canned in water)",
    calories_per_100g: 116,
    proteins_per_100g: 26,
    carbohydrates_per_100g: 0,
    fats_per_100g: 1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_007",
    name: "Turkey Breast",
    calories_per_100g: 135,
    proteins_per_100g: 30,
    carbohydrates_per_100g: 0,
    fats_per_100g: 1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_008",
    name: "Greek Yogurt (plain, non-fat)",
    calories_per_100g: 59,
    proteins_per_100g: 10,
    carbohydrates_per_100g: 3.6,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_009",
    name: "Cottage Cheese (low-fat)",
    calories_per_100g: 98,
    proteins_per_100g: 11,
    carbohydrates_per_100g: 3.4,
    fats_per_100g: 4.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_010",
    name: "Cod",
    calories_per_100g: 82,
    proteins_per_100g: 18,
    carbohydrates_per_100g: 0,
    fats_per_100g: 0.7,
    isCustom: false,
    user_id: null
  },

  // GRAINS & STARCHES
  {
    _id: "food_011",
    name: "Brown Rice (cooked)",
    calories_per_100g: 111,
    proteins_per_100g: 2.6,
    carbohydrates_per_100g: 23,
    fats_per_100g: 0.9,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_012",
    name: "White Rice (cooked)",
    calories_per_100g: 130,
    proteins_per_100g: 2.7,
    carbohydrates_per_100g: 28,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_013",
    name: "Whole Wheat Bread",
    calories_per_100g: 247,
    proteins_per_100g: 13,
    carbohydrates_per_100g: 41,
    fats_per_100g: 4.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_014",
    name: "White Bread",
    calories_per_100g: 265,
    proteins_per_100g: 9,
    carbohydrates_per_100g: 49,
    fats_per_100g: 3.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_015",
    name: "Pasta (whole wheat, cooked)",
    calories_per_100g: 124,
    proteins_per_100g: 5,
    carbohydrates_per_100g: 25,
    fats_per_100g: 1.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_016",
    name: "Pasta (regular, cooked)",
    calories_per_100g: 131,
    proteins_per_100g: 5,
    carbohydrates_per_100g: 25,
    fats_per_100g: 1.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_017",
    name: "Oats (rolled, dry)",
    calories_per_100g: 389,
    proteins_per_100g: 17,
    carbohydrates_per_100g: 66,
    fats_per_100g: 7,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_018",
    name: "Quinoa (cooked)",
    calories_per_100g: 120,
    proteins_per_100g: 4.4,
    carbohydrates_per_100g: 22,
    fats_per_100g: 1.9,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_019",
    name: "Sweet Potato (baked)",
    calories_per_100g: 90,
    proteins_per_100g: 2,
    carbohydrates_per_100g: 21,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_020",
    name: "Regular Potato (baked)",
    calories_per_100g: 93,
    proteins_per_100g: 2.5,
    carbohydrates_per_100g: 21,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },

  // FRUITS
  {
    _id: "food_021",
    name: "Apple (with skin)",
    calories_per_100g: 52,
    proteins_per_100g: 0.3,
    carbohydrates_per_100g: 14,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_022",
    name: "Banana",
    calories_per_100g: 89,
    proteins_per_100g: 1.1,
    carbohydrates_per_100g: 23,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_023",
    name: "Orange",
    calories_per_100g: 47,
    proteins_per_100g: 0.9,
    carbohydrates_per_100g: 12,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_024",
    name: "Strawberries",
    calories_per_100g: 32,
    proteins_per_100g: 0.7,
    carbohydrates_per_100g: 8,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_025",
    name: "Blueberries",
    calories_per_100g: 57,
    proteins_per_100g: 0.7,
    carbohydrates_per_100g: 14,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_026",
    name: "Grapes",
    calories_per_100g: 62,
    proteins_per_100g: 0.6,
    carbohydrates_per_100g: 16,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_027",
    name: "Pineapple",
    calories_per_100g: 50,
    proteins_per_100g: 0.5,
    carbohydrates_per_100g: 13,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_028",
    name: "Mango",
    calories_per_100g: 60,
    proteins_per_100g: 0.8,
    carbohydrates_per_100g: 15,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_029",
    name: "Avocado",
    calories_per_100g: 160,
    proteins_per_100g: 2,
    carbohydrates_per_100g: 9,
    fats_per_100g: 15,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_030",
    name: "Watermelon",
    calories_per_100g: 30,
    proteins_per_100g: 0.6,
    carbohydrates_per_100g: 8,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },

  // VEGETABLES
  {
    _id: "food_031",
    name: "Broccoli",
    calories_per_100g: 34,
    proteins_per_100g: 2.8,
    carbohydrates_per_100g: 7,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_032",
    name: "Spinach",
    calories_per_100g: 23,
    proteins_per_100g: 2.9,
    carbohydrates_per_100g: 3.6,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_033",
    name: "Carrots",
    calories_per_100g: 41,
    proteins_per_100g: 0.9,
    carbohydrates_per_100g: 10,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_034",
    name: "Tomatoes",
    calories_per_100g: 18,
    proteins_per_100g: 0.9,
    carbohydrates_per_100g: 3.9,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_035",
    name: "Bell Peppers (red)",
    calories_per_100g: 31,
    proteins_per_100g: 1,
    carbohydrates_per_100g: 7,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_036",
    name: "Cucumber",
    calories_per_100g: 16,
    proteins_per_100g: 0.7,
    carbohydrates_per_100g: 4,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_037",
    name: "Lettuce (romaine)",
    calories_per_100g: 17,
    proteins_per_100g: 1.2,
    carbohydrates_per_100g: 3.3,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_038",
    name: "Onions",
    calories_per_100g: 40,
    proteins_per_100g: 1.1,
    carbohydrates_per_100g: 9,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_039",
    name: "Mushrooms (white)",
    calories_per_100g: 22,
    proteins_per_100g: 3.1,
    carbohydrates_per_100g: 3.3,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_040",
    name: "Zucchini",
    calories_per_100g: 17,
    proteins_per_100g: 1.2,
    carbohydrates_per_100g: 3.1,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },

  // DAIRY PRODUCTS
  {
    _id: "food_041",
    name: "Milk (whole)",
    calories_per_100g: 61,
    proteins_per_100g: 3.2,
    carbohydrates_per_100g: 4.8,
    fats_per_100g: 3.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_042",
    name: "Milk (2% fat)",
    calories_per_100g: 50,
    proteins_per_100g: 3.3,
    carbohydrates_per_100g: 4.8,
    fats_per_100g: 2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_043",
    name: "Milk (skim)",
    calories_per_100g: 34,
    proteins_per_100g: 3.4,
    carbohydrates_per_100g: 5,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_044",
    name: "Cheddar Cheese",
    calories_per_100g: 403,
    proteins_per_100g: 25,
    carbohydrates_per_100g: 1.3,
    fats_per_100g: 33,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_045",
    name: "Mozzarella Cheese",
    calories_per_100g: 300,
    proteins_per_100g: 22,
    carbohydrates_per_100g: 2.2,
    fats_per_100g: 22,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_046",
    name: "Yogurt (plain, whole milk)",
    calories_per_100g: 61,
    proteins_per_100g: 3.5,
    carbohydrates_per_100g: 4.7,
    fats_per_100g: 3.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_047",
    name: "Butter",
    calories_per_100g: 717,
    proteins_per_100g: 0.9,
    carbohydrates_per_100g: 0.1,
    fats_per_100g: 81,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_048",
    name: "Cream Cheese",
    calories_per_100g: 342,
    proteins_per_100g: 6,
    carbohydrates_per_100g: 4,
    fats_per_100g: 34,
    isCustom: false,
    user_id: null
  },

  // NUTS & SEEDS
  {
    _id: "food_049",
    name: "Almonds",
    calories_per_100g: 579,
    proteins_per_100g: 21,
    carbohydrates_per_100g: 22,
    fats_per_100g: 50,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_050",
    name: "Walnuts",
    calories_per_100g: 654,
    proteins_per_100g: 15,
    carbohydrates_per_100g: 14,
    fats_per_100g: 65,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_051",
    name: "Peanuts",
    calories_per_100g: 567,
    proteins_per_100g: 26,
    carbohydrates_per_100g: 16,
    fats_per_100g: 49,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_052",
    name: "Cashews",
    calories_per_100g: 553,
    proteins_per_100g: 18,
    carbohydrates_per_100g: 30,
    fats_per_100g: 44,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_053",
    name: "Chia Seeds",
    calories_per_100g: 486,
    proteins_per_100g: 17,
    carbohydrates_per_100g: 42,
    fats_per_100g: 31,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_054",
    name: "Flaxseeds",
    calories_per_100g: 534,
    proteins_per_100g: 18,
    carbohydrates_per_100g: 29,
    fats_per_100g: 42,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_055",
    name: "Sunflower Seeds",
    calories_per_100g: 584,
    proteins_per_100g: 21,
    carbohydrates_per_100g: 20,
    fats_per_100g: 51,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_056",
    name: "Pumpkin Seeds",
    calories_per_100g: 559,
    proteins_per_100g: 30,
    carbohydrates_per_100g: 11,
    fats_per_100g: 49,
    isCustom: false,
    user_id: null
  },

  // LEGUMES
  {
    _id: "food_057",
    name: "Black Beans (cooked)",
    calories_per_100g: 132,
    proteins_per_100g: 8.9,
    carbohydrates_per_100g: 23,
    fats_per_100g: 0.5,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_058",
    name: "Kidney Beans (cooked)",
    calories_per_100g: 127,
    proteins_per_100g: 8.7,
    carbohydrates_per_100g: 23,
    fats_per_100g: 0.5,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_059",
    name: "Chickpeas (cooked)",
    calories_per_100g: 164,
    proteins_per_100g: 8.9,
    carbohydrates_per_100g: 27,
    fats_per_100g: 2.6,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_060",
    name: "Lentils (cooked)",
    calories_per_100g: 116,
    proteins_per_100g: 9,
    carbohydrates_per_100g: 20,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_061",
    name: "Green Peas",
    calories_per_100g: 81,
    proteins_per_100g: 5.4,
    carbohydrates_per_100g: 14,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_062",
    name: "Soybeans (cooked)",
    calories_per_100g: 173,
    proteins_per_100g: 17,
    carbohydrates_per_100g: 10,
    fats_per_100g: 9,
    isCustom: false,
    user_id: null
  },

  // PROCESSED & CONVENIENCE FOODS
  {
    _id: "food_063",
    name: "Pizza (cheese, regular crust)",
    calories_per_100g: 266,
    proteins_per_100g: 11,
    carbohydrates_per_100g: 33,
    fats_per_100g: 10,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_064",
    name: "Hamburger (fast food)",
    calories_per_100g: 295,
    proteins_per_100g: 17,
    carbohydrates_per_100g: 24,
    fats_per_100g: 15,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_065",
    name: "French Fries",
    calories_per_100g: 365,
    proteins_per_100g: 4,
    carbohydrates_per_100g: 63,
    fats_per_100g: 17,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_066",
    name: "Potato Chips",
    calories_per_100g: 536,
    proteins_per_100g: 7,
    carbohydrates_per_100g: 53,
    fats_per_100g: 35,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_067",
    name: "Ice Cream (vanilla)",
    calories_per_100g: 207,
    proteins_per_100g: 3.5,
    carbohydrates_per_100g: 24,
    fats_per_100g: 11,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_068",
    name: "Chocolate (dark, 70% cacao)",
    calories_per_100g: 598,
    proteins_per_100g: 8,
    carbohydrates_per_100g: 46,
    fats_per_100g: 43,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_069",
    name: "Cookies (chocolate chip)",
    calories_per_100g: 488,
    proteins_per_100g: 5.9,
    carbohydrates_per_100g: 68,
    fats_per_100g: 23,
    isCustom: false,
    user_id: null
  },

  // BEVERAGES & OTHERS
  {
    _id: "food_070",
    name: "Coffee (black)",
    calories_per_100g: 2,
    proteins_per_100g: 0.3,
    carbohydrates_per_100g: 0,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_071",
    name: "Green Tea",
    calories_per_100g: 1,
    proteins_per_100g: 0,
    carbohydrates_per_100g: 0,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_072",
    name: "Orange Juice",
    calories_per_100g: 45,
    proteins_per_100g: 0.7,
    carbohydrates_per_100g: 10,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_073",
    name: "Soda (cola)",
    calories_per_100g: 42,
    proteins_per_100g: 0,
    carbohydrates_per_100g: 11,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_074",
    name: "Beer (regular)",
    calories_per_100g: 43,
    proteins_per_100g: 0.5,
    carbohydrates_per_100g: 3.6,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_075",
    name: "Wine (red)",
    calories_per_100g: 85,
    proteins_per_100g: 0.1,
    carbohydrates_per_100g: 2.6,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },

  // INTERNATIONAL & SPECIALTY FOODS
  {
    _id: "food_076",
    name: "Sushi (salmon roll)",
    calories_per_100g: 179,
    proteins_per_100g: 8.8,
    carbohydrates_per_100g: 24,
    fats_per_100g: 4.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_077",
    name: "Hummus",
    calories_per_100g: 166,
    proteins_per_100g: 8,
    carbohydrates_per_100g: 14,
    fats_per_100g: 10,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_078",
    name: "Guacamole",
    calories_per_100g: 150,
    proteins_per_100g: 2,
    carbohydrates_per_100g: 8,
    fats_per_100g: 14,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_079",
    name: "Kimchi",
    calories_per_100g: 15,
    proteins_per_100g: 1.1,
    carbohydrates_per_100g: 2.4,
    fats_per_100g: 0.5,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_080",
    name: "Tempeh",
    calories_per_100g: 190,
    proteins_per_100g: 19,
    carbohydrates_per_100g: 9,
    fats_per_100g: 11,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_081",
    name: "Seitan",
    calories_per_100g: 370,
    proteins_per_100g: 75,
    carbohydrates_per_100g: 14,
    fats_per_100g: 2,
    isCustom: false,
    user_id: null
  },

  // ADDITIONAL PROTEINS
  {
    _id: "food_082",
    name: "Pork Tenderloin",
    calories_per_100g: 143,
    proteins_per_100g: 26,
    carbohydrates_per_100g: 0,
    fats_per_100g: 4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_083",
    name: "Lamb (lean)",
    calories_per_100g: 294,
    proteins_per_100g: 25,
    carbohydrates_per_100g: 0,
    fats_per_100g: 21,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_084",
    name: "Shrimp",
    calories_per_100g: 99,
    proteins_per_100g: 18,
    carbohydrates_per_100g: 0.9,
    fats_per_100g: 1.7,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_085",
    name: "Crab",
    calories_per_100g: 97,
    proteins_per_100g: 19,
    carbohydrates_per_100g: 0,
    fats_per_100g: 1.5,
    isCustom: false,
    user_id: null
  },

  // ADDITIONAL FRUITS & VEGETABLES
  {
    _id: "food_086",
    name: "Kiwi",
    calories_per_100g: 61,
    proteins_per_100g: 1.1,
    carbohydrates_per_100g: 15,
    fats_per_100g: 0.5,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_087",
    name: "Papaya",
    calories_per_100g: 43,
    proteins_per_100g: 0.5,
    carbohydrates_per_100g: 11,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_088",
    name: "Asparagus",
    calories_per_100g: 20,
    proteins_per_100g: 2.2,
    carbohydrates_per_100g: 3.9,
    fats_per_100g: 0.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_089",
    name: "Brussels Sprouts",
    calories_per_100g: 43,
    proteins_per_100g: 3.4,
    carbohydrates_per_100g: 9,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_090",
    name: "Cauliflower",
    calories_per_100g: 25,
    proteins_per_100g: 1.9,
    carbohydrates_per_100g: 5,
    fats_per_100g: 0.3,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_091",
    name: "Eggplant",
    calories_per_100g: 25,
    proteins_per_100g: 1,
    carbohydrates_per_100g: 6,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },

  // ADDITIONAL GRAINS & STARCHES
  {
    _id: "food_092",
    name: "Barley (cooked)",
    calories_per_100g: 123,
    proteins_per_100g: 2.3,
    carbohydrates_per_100g: 28,
    fats_per_100g: 0.4,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_093",
    name: "Bulgur (cooked)",
    calories_per_100g: 83,
    proteins_per_100g: 3,
    carbohydrates_per_100g: 19,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_094",
    name: "Couscous (cooked)",
    calories_per_100g: 112,
    proteins_per_100g: 3.8,
    carbohydrates_per_100g: 23,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },

  // CONDIMENTS & OILS
  {
    _id: "food_095",
    name: "Olive Oil",
    calories_per_100g: 884,
    proteins_per_100g: 0,
    carbohydrates_per_100g: 0,
    fats_per_100g: 100,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_096",
    name: "Coconut Oil",
    calories_per_100g: 862,
    proteins_per_100g: 0,
    carbohydrates_per_100g: 0,
    fats_per_100g: 100,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_097",
    name: "Honey",
    calories_per_100g: 304,
    proteins_per_100g: 0.3,
    carbohydrates_per_100g: 82,
    fats_per_100g: 0,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_098",
    name: "Maple Syrup",
    calories_per_100g: 260,
    proteins_per_100g: 0,
    carbohydrates_per_100g: 67,
    fats_per_100g: 0.2,
    isCustom: false,
    user_id: null
  },

  // PLANT-BASED ALTERNATIVES
  {
    _id: "food_099",
    name: "Almond Milk (unsweetened)",
    calories_per_100g: 15,
    proteins_per_100g: 0.6,
    carbohydrates_per_100g: 0.6,
    fats_per_100g: 1.1,
    isCustom: false,
    user_id: null
  },
  {
    _id: "food_100",
    name: "Soy Milk (unsweetened)",
    calories_per_100g: 33,
    proteins_per_100g: 2.9,
    carbohydrates_per_100g: 1.2,
    fats_per_100g: 1.8,
    isCustom: false,
    user_id: null
  }
];

// @desc    Get all GLOBAL food items
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    // Fetch all food items from the database (for debugging)
    const foods = await Food.find({}); // Fetch all documents
    console.log(`Fetched ${foods.length} food items (for debugging):`, foods);
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ message: 'Server Error fetching food items', error: error.message });
  }
};

// @desc    Create a new GLOBAL food item (for admin/seeding purposes)
// @route   POST /api/foods (This route might need to be admin-protected)
// @access  Private (potentially admin-only)
const createFood = async (req, res) => {
    try {
        const { name, calories_per_100g, proteins_per_100g, carbohydrates_per_100g, fats_per_100g } = req.body;

        // Basic validation for global food items
        if (!name || calories_per_100g === undefined || proteins_per_100g === undefined || carbohydrates_per_100g === undefined || fats_per_100g === undefined) {
            return res.status(400).json({ message: 'Please include all required fields for global food item' });
        }

        // For global food items, names should be unique among global items
        const foodExists = await Food.findOne({ name, isCustom: false, user_id: null });
        if (foodExists) {
            return res.status(400).json({ message: 'Global food item with that name already exists' });
        }

        const food = await Food.create({
            name,
            calories_per_100g,
            proteins_per_100g,
            carbohydrates_per_100g,
            fats_per_100g,
            isCustom: false, // Explicitly global
            user_id: null    // Explicitly global
        });

        res.status(201).json(food);
    } catch (error) {
        console.error('Error creating global food item:', error);
        res.status(500).json({ message: 'Server Error creating global food item', error: error.message });
    }
};

// @desc    Create a new CUSTOM food item for the logged-in user
// @route   POST /api/foods/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const createCustomFood = async (req, res) => {
    try {
        const { name, calories_per_100g, proteins_per_100g, carbohydrates_per_100g, fats_per_100g } = req.body;

        // Basic validation for custom food items
        if (!name || calories_per_100g === undefined || proteins_per_100g === undefined || carbohydrates_per_100g === undefined || fats_per_100g === undefined) {
            return res.status(400).json({ message: 'Please include all required fields for custom food item' });
        }
        
        // Note: As per requirements, not enforcing (name, user_id) uniqueness for simplicity for now.

        const customFood = await Food.create({
            name,
            calories_per_100g,
            proteins_per_100g,
            carbohydrates_per_100g,
            fats_per_100g,
            isCustom: true,
            user_id: req.user.id // req.user.id is populated by the 'protect' auth middleware
        });

        res.status(201).json(customFood);
    } catch (error) {
        console.error('Error creating custom food item:', error);
        res.status(500).json({ message: 'Server Error creating custom food item', error: error.message });
    }
};

// @desc    Get all CUSTOM food items for the logged-in user
// @route   GET /api/foods/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const getCustomFoods = async (req, res) => {
    try {
        const customFoods = await Food.find({ user_id: req.user.id, isCustom: true });
        res.status(200).json(customFoods);
    } catch (error) {
        console.error('Error fetching custom food items:', error);
        res.status(500).json({ message: 'Server Error fetching custom food items', error: error.message });
    }
};

module.exports = { getFoods, createFood, createCustomFood, getCustomFoods };
