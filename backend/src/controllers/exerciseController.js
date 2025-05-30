// backend/src/controllers/exerciseController.js

const Exercise = require('../models/exercise');

// Hardcoded exercise data - 100 exercises with calorie burn data
const HARDCODED_EXERCISES = [
  // CARDIOVASCULAR EXERCISES
  {
    _id: "exercise_001",
    name: "Running (6 mph)",
    description: "Running at a moderate pace of 6 mph.",
    category: "Cardio",
    default_calories_per_unit: 10,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_002",
    name: "Running (8 mph)",
    description: "Running at a fast pace of 8 mph.",
    category: "Cardio",
    default_calories_per_unit: 13,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_003",
    name: "Jogging (5 mph)",
    description: "Light jogging at 5 mph pace.",
    category: "Cardio",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_004",
    name: "Walking (3.5 mph)",
    description: "Brisk walking at moderate pace.",
    category: "Cardio",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_005",
    name: "Walking (2.5 mph)",
    description: "Casual walking at slow pace.",
    category: "Cardio",
    default_calories_per_unit: 3,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_006",
    name: "Cycling (moderate, 12-14 mph)",
    description: "Cycling at moderate intensity.",
    category: "Cardio",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_007",
    name: "Cycling (vigorous, 16-19 mph)",
    description: "Cycling at high intensity.",
    category: "Cardio",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_008",
    name: "Swimming (freestyle, moderate)",
    description: "Swimming freestyle at moderate pace.",
    category: "Cardio",
    default_calories_per_unit: 11,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_009",
    name: "Swimming (freestyle, vigorous)",
    description: "Swimming freestyle at high intensity.",
    category: "Cardio",
    default_calories_per_unit: 13,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_010",
    name: "Elliptical Machine",
    description: "Elliptical trainer workout.",
    category: "Cardio",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_011",
    name: "Rowing Machine",
    description: "Indoor rowing machine workout.",
    category: "Cardio",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_012",
    name: "Stair Climbing",
    description: "Climbing stairs for cardio.",
    category: "Cardio",
    default_calories_per_unit: 15,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_013",
    name: "Jump Rope",
    description: "Jumping rope for cardio.",
    category: "Cardio",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_014",
    name: "Dancing (general)",
    description: "General dancing for fitness.",
    category: "Cardio",
    default_calories_per_unit: 6,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_015",
    name: "Zumba",
    description: "High-energy dance fitness class.",
    category: "Cardio",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // STRENGTH TRAINING - UPPER BODY
  {
    _id: "exercise_016",
    name: "Push-ups",
    description: "Bodyweight exercise for chest, shoulders, and triceps.",
    category: "Strength",
    default_calories_per_unit: 0.5,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_017",
    name: "Pull-ups",
    description: "Bodyweight exercise for back and biceps.",
    category: "Strength",
    default_calories_per_unit: 1.2,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_018",
    name: "Chin-ups",
    description: "Underhand grip pull-ups targeting biceps.",
    category: "Strength",
    default_calories_per_unit: 1.1,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_019",
    name: "Bench Press",
    description: "Barbell or dumbbell chest press.",
    category: "Strength",
    default_calories_per_unit: 1.5,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_020",
    name: "Dumbbell Rows",
    description: "Bent-over dumbbell rows for back.",
    category: "Strength",
    default_calories_per_unit: 1.0,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_021",
    name: "Overhead Press",
    description: "Standing or seated shoulder press.",
    category: "Strength",
    default_calories_per_unit: 1.2,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_022",
    name: "Bicep Curls",
    description: "Dumbbell or barbell bicep curls.",
    category: "Strength",
    default_calories_per_unit: 0.8,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_023",
    name: "Tricep Dips",
    description: "Bodyweight tricep dips on chair or bench.",
    category: "Strength",
    default_calories_per_unit: 0.9,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_024",
    name: "Lateral Raises",
    description: "Dumbbell lateral raises for shoulders.",
    category: "Strength",
    default_calories_per_unit: 0.6,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_025",
    name: "Chest Flyes",
    description: "Dumbbell chest flyes.",
    category: "Strength",
    default_calories_per_unit: 0.8,
    unit: "reps",
    isCustom: false,
    user_id: null
  },

  // STRENGTH TRAINING - LOWER BODY
  {
    _id: "exercise_026",
    name: "Squats (bodyweight)",
    description: "Bodyweight squats for lower body.",
    category: "Strength",
    default_calories_per_unit: 0.7,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_027",
    name: "Squats (weighted)",
    description: "Barbell or dumbbell squats.",
    category: "Strength",
    default_calories_per_unit: 1.5,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_028",
    name: "Deadlifts",
    description: "Barbell deadlifts for posterior chain.",
    category: "Strength",
    default_calories_per_unit: 2.0,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_029",
    name: "Lunges",
    description: "Forward or reverse lunges.",
    category: "Strength",
    default_calories_per_unit: 1.0,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_030",
    name: "Bulgarian Split Squats",
    description: "Single-leg squats with rear foot elevated.",
    category: "Strength",
    default_calories_per_unit: 1.2,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_031",
    name: "Calf Raises",
    description: "Standing or seated calf raises.",
    category: "Strength",
    default_calories_per_unit: 0.4,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_032",
    name: "Leg Press",
    description: "Machine leg press exercise.",
    category: "Strength",
    default_calories_per_unit: 1.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_033",
    name: "Hip Thrusts",
    description: "Glute-focused hip thrust exercise.",
    category: "Strength",
    default_calories_per_unit: 1.1,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_034",
    name: "Step-ups",
    description: "Step-ups on bench or platform.",
    category: "Strength",
    default_calories_per_unit: 0.8,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_035",
    name: "Wall Sits",
    description: "Isometric wall sit exercise.",
    category: "Strength",
    default_calories_per_unit: 0.2,
    unit: "seconds",
    isCustom: false,
    user_id: null
  },

  // CORE & ABDOMINAL EXERCISES
  {
    _id: "exercise_036",
    name: "Planks",
    description: "Standard plank hold for core stability.",
    category: "Core",
    default_calories_per_unit: 0.2,
    unit: "seconds",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_037",
    name: "Side Planks",
    description: "Side plank for obliques and core.",
    category: "Core",
    default_calories_per_unit: 0.25,
    unit: "seconds",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_038",
    name: "Crunches",
    description: "Basic abdominal crunches.",
    category: "Core",
    default_calories_per_unit: 0.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_039",
    name: "Bicycle Crunches",
    description: "Alternating bicycle crunches.",
    category: "Core",
    default_calories_per_unit: 0.4,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_040",
    name: "Russian Twists",
    description: "Seated twisting motion for obliques.",
    category: "Core",
    default_calories_per_unit: 0.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_041",
    name: "Leg Raises",
    description: "Lying leg raises for lower abs.",
    category: "Core",
    default_calories_per_unit: 0.5,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_042",
    name: "Mountain Climbers",
    description: "Dynamic mountain climber exercise.",
    category: "Core",
    default_calories_per_unit: 0.6,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_043",
    name: "Dead Bug",
    description: "Core stability exercise lying on back.",
    category: "Core",
    default_calories_per_unit: 0.4,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_044",
    name: "Bird Dog",
    description: "Quadruped core stability exercise.",
    category: "Core",
    default_calories_per_unit: 0.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_045",
    name: "Hanging Knee Raises",
    description: "Hanging from bar, raising knees to chest.",
    category: "Core",
    default_calories_per_unit: 0.8,
    unit: "reps",
    isCustom: false,
    user_id: null
  },

  // HIIT & FUNCTIONAL MOVEMENTS
  {
    _id: "exercise_046",
    name: "Burpees",
    description: "Full-body explosive movement.",
    category: "HIIT",
    default_calories_per_unit: 1.5,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_047",
    name: "Jumping Jacks",
    description: "Classic jumping jack exercise.",
    category: "HIIT",
    default_calories_per_unit: 0.4,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_048",
    name: "High Knees",
    description: "Running in place with high knees.",
    category: "HIIT",
    default_calories_per_unit: 0.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_049",
    name: "Butt Kickers",
    description: "Running in place kicking heels to glutes.",
    category: "HIIT",
    default_calories_per_unit: 0.3,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_050",
    name: "Box Jumps",
    description: "Jumping onto elevated platform.",
    category: "HIIT",
    default_calories_per_unit: 1.2,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_051",
    name: "Kettlebell Swings",
    description: "Hip-hinge kettlebell swing movement.",
    category: "Functional",
    default_calories_per_unit: 1.0,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_052",
    name: "Turkish Get-ups",
    description: "Complex full-body movement with weight.",
    category: "Functional",
    default_calories_per_unit: 3.0,
    unit: "reps",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_053",
    name: "Farmer's Walk",
    description: "Walking while carrying heavy weights.",
    category: "Functional",
    default_calories_per_unit: 0.5,
    unit: "meters",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_054",
    name: "Bear Crawl",
    description: "Crawling on hands and feet.",
    category: "Functional",
    default_calories_per_unit: 0.8,
    unit: "meters",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_055",
    name: "Crab Walk",
    description: "Walking in crab position.",
    category: "Functional",
    default_calories_per_unit: 0.6,
    unit: "meters",
    isCustom: false,
    user_id: null
  },

  // FLEXIBILITY & MOBILITY
  {
    _id: "exercise_056",
    name: "Yoga (Hatha)",
    description: "Gentle yoga practice.",
    category: "Flexibility",
    default_calories_per_unit: 3,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_057",
    name: "Yoga (Vinyasa)",
    description: "Dynamic flowing yoga practice.",
    category: "Flexibility",
    default_calories_per_unit: 5,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_058",
    name: "Yoga (Power)",
    description: "Intense power yoga session.",
    category: "Flexibility",
    default_calories_per_unit: 7,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_059",
    name: "Static Stretching",
    description: "Holding stretches for flexibility.",
    category: "Flexibility",
    default_calories_per_unit: 2,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_060",
    name: "Dynamic Stretching",
    description: "Moving stretches for warm-up.",
    category: "Flexibility",
    default_calories_per_unit: 3,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_061",
    name: "Foam Rolling",
    description: "Self-myofascial release with foam roller.",
    category: "Flexibility",
    default_calories_per_unit: 2,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_062",
    name: "Pilates",
    description: "Core-focused Pilates workout.",
    category: "Flexibility",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // SPORTS ACTIVITIES
  {
    _id: "exercise_063",
    name: "Basketball (game)",
    description: "Playing basketball game.",
    category: "Sports",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_064",
    name: "Basketball (shooting)",
    description: "Basketball shooting practice.",
    category: "Sports",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_065",
    name: "Tennis (singles)",
    description: "Playing singles tennis.",
    category: "Sports",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_066",
    name: "Tennis (doubles)",
    description: "Playing doubles tennis.",
    category: "Sports",
    default_calories_per_unit: 6,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_067",
    name: "Soccer",
    description: "Playing soccer/football.",
    category: "Sports",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_068",
    name: "Volleyball",
    description: "Playing volleyball.",
    category: "Sports",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_069",
    name: "Baseball/Softball",
    description: "Playing baseball or softball.",
    category: "Sports",
    default_calories_per_unit: 5,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_070",
    name: "Golf (walking)",
    description: "Playing golf while walking course.",
    category: "Sports",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_071",
    name: "Golf (cart)",
    description: "Playing golf using cart.",
    category: "Sports",
    default_calories_per_unit: 3,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_072",
    name: "Badminton",
    description: "Playing badminton.",
    category: "Sports",
    default_calories_per_unit: 6,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // MARTIAL ARTS & COMBAT SPORTS
  {
    _id: "exercise_073",
    name: "Boxing (training)",
    description: "Boxing training workout.",
    category: "Combat",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_074",
    name: "Kickboxing",
    description: "Kickboxing workout.",
    category: "Combat",
    default_calories_per_unit: 10,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_075",
    name: "Karate",
    description: "Karate practice.",
    category: "Combat",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_076",
    name: "Taekwondo",
    description: "Taekwondo practice.",
    category: "Combat",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_077",
    name: "Judo",
    description: "Judo practice.",
    category: "Combat",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_078",
    name: "Brazilian Jiu-Jitsu",
    description: "BJJ training session.",
    category: "Combat",
    default_calories_per_unit: 10,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_079",
    name: "Mixed Martial Arts (MMA)",
    description: "MMA training session.",
    category: "Combat",
    default_calories_per_unit: 11,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // OUTDOOR ACTIVITIES
  {
    _id: "exercise_080",
    name: "Hiking (moderate terrain)",
    description: "Hiking on moderate terrain.",
    category: "Outdoor",
    default_calories_per_unit: 6,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_081",
    name: "Hiking (steep terrain)",
    description: "Hiking on steep, challenging terrain.",
    category: "Outdoor",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_082",
    name: "Rock Climbing (indoor)",
    description: "Indoor rock climbing.",
    category: "Outdoor",
    default_calories_per_unit: 11,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_083",
    name: "Rock Climbing (outdoor)",
    description: "Outdoor rock climbing.",
    category: "Outdoor",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_084",
    name: "Kayaking",
    description: "Kayaking on water.",
    category: "Outdoor",
    default_calories_per_unit: 5,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_085",
    name: "Canoeing",
    description: "Canoeing on water.",
    category: "Outdoor",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_086",
    name: "Skiing (downhill)",
    description: "Downhill skiing.",
    category: "Outdoor",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_087",
    name: "Skiing (cross-country)",
    description: "Cross-country skiing.",
    category: "Outdoor",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_088",
    name: "Snowboarding",
    description: "Snowboarding down slopes.",
    category: "Outdoor",
    default_calories_per_unit: 7,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_089",
    name: "Surfing",
    description: "Surfing waves.",
    category: "Outdoor",
    default_calories_per_unit: 6,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // GENERAL FITNESS CLASSES
  {
    _id: "exercise_090",
    name: "Aerobics (low impact)",
    description: "Low impact aerobics class.",
    category: "Group Fitness",
    default_calories_per_unit: 5,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_091",
    name: "Aerobics (high impact)",
    description: "High impact aerobics class.",
    category: "Group Fitness",
    default_calories_per_unit: 7,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_092",
    name: "Step Aerobics",
    description: "Step aerobics class.",
    category: "Group Fitness",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_093",
    name: "Spin Class",
    description: "Indoor cycling spin class.",
    category: "Group Fitness",
    default_calories_per_unit: 12,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_094",
    name: "CrossFit",
    description: "High-intensity CrossFit workout.",
    category: "Group Fitness",
    default_calories_per_unit: 15,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_095",
    name: "Boot Camp",
    description: "Military-style fitness boot camp.",
    category: "Group Fitness",
    default_calories_per_unit: 10,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_096",
    name: "Circuit Training",
    description: "Circuit training workout.",
    category: "Group Fitness",
    default_calories_per_unit: 8,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },

  // WATER ACTIVITIES
  {
    _id: "exercise_097",
    name: "Water Aerobics",
    description: "Aerobics performed in water.",
    category: "Water",
    default_calories_per_unit: 4,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_098",
    name: "Swimming (backstroke)",
    description: "Swimming backstroke.",
    category: "Water",
    default_calories_per_unit: 9,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_099",
    name: "Swimming (breaststroke)",
    description: "Swimming breaststroke.",
    category: "Water",
    default_calories_per_unit: 10,
    unit: "minutes",
    isCustom: false,
    user_id: null
  },
  {
    _id: "exercise_100",
    name: "Swimming (butterfly)",
    description: "Swimming butterfly stroke.",
    category: "Water",
    default_calories_per_unit: 14,
    unit: "minutes",
    isCustom: false,
    user_id: null
  }
];

// @desc    Get all GLOBAL exercises
// @route   GET /api/exercises
// @access  Public
const getExercises = async (req, res) => {
  try {
    // Fetch all exercises from the database (for debugging)
    const exercises = await Exercise.find({}); // Fetch all documents
    console.log(`Fetched ${exercises.length} exercises (for debugging):`, exercises);
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Server Error fetching exercises', error: error.message });
  }
};

// @desc    Create a new GLOBAL exercise (for admin/seeding purposes)
// @route   POST /api/exercises (This route might need to be admin-protected)
// @access  Private (potentially admin-only)
const createExercise = async (req, res) => {
    try {
        const { name, description, category, default_calories_per_unit, unit } = req.body;

        // Basic validation for global exercises
        if (!name || !description || !category || default_calories_per_unit === undefined || !unit) {
            return res.status(400).json({ message: 'Please fill in all required exercise fields for global exercise' });
        }

        // For global exercises, names should be unique among global exercises
        const exerciseExists = await Exercise.findOne({ name, isCustom: false, user_id: null });
        if (exerciseExists) {
            return res.status(400).json({ message: 'Global exercise with that name already exists' });
        }

        const exercise = await Exercise.create({
            name,
            description,
            category,
            default_calories_per_unit,
            unit,
            isCustom: false, // Explicitly global
            user_id: null    // Explicitly global
        });

        res.status(201).json(exercise);
    } catch (error) {
        console.error('Error creating global exercise:', error);
        res.status(500).json({ message: 'Server Error creating global exercise', error: error.message });
    }
};

// @desc    Create a new CUSTOM exercise for the logged-in user
// @route   POST /api/exercises/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const createCustomExercise = async (req, res) => {
    try {
        const { name, description, category, default_calories_per_unit, unit } = req.body;

        // Basic validation for custom exercises
        if (!name || !description || !category || default_calories_per_unit === undefined || !unit) {
            return res.status(400).json({ message: 'Please fill in all required fields for custom exercise' });
        }

        const customExercise = await Exercise.create({
            name,
            description,
            category,
            default_calories_per_unit,
            unit,
            isCustom: true,
            user_id: req.user.id // req.user.id is populated by the 'protect' auth middleware
        });

        res.status(201).json(customExercise);
    } catch (error) {
        console.error('Error creating custom exercise:', error);
        res.status(500).json({ message: 'Server Error creating custom exercise', error: error.message });
    }
};

// @desc    Get all CUSTOM exercises for the logged-in user
// @route   GET /api/exercises/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const getCustomExercises = async (req, res) => {
    try {
        const customExercises = await Exercise.find({ user_id: req.user.id, isCustom: true });
        res.status(200).json(customExercises);
    } catch (error) {
        console.error('Error fetching custom exercises:', error);
        res.status(500).json({ message: 'Server Error fetching custom exercises', error: error.message });
    }
};

module.exports = { getExercises, createExercise, createCustomExercise, getCustomExercises };
