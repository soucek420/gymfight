// GYMFIGHT/backend/src/database/seeders/aiOpponentSeeder.js
const mongoose = require('mongoose');
const AiOpponent = require('../../models/aiOpponent');
const { connectDB, closeDB } = require('../connection'); // Assuming connection.js exports these

const aiOpponentsData = [
    // Level 1-3: Introductory
    {
        name: "Training Dummy",
        level: 1,
        stats: { attack: 5, defense: 2, health_points: 30, speed: 5 },
        abilities: ["Strike"],
        rewards: { experience: 10, currency: 5, items: ["Scrap Metal"] }
    },
    {
        name: "Goblin Scout",
        level: 2,
        stats: { attack: 8, defense: 3, health_points: 40, speed: 15 },
        abilities: ["Strike", "Quick Heal"], // Assuming Quick Heal is a low-power heal
        rewards: { experience: 15, currency: 10, items: ["Goblin Ear", "Tattered Cloth"] }
    },
    {
        name: "Forest Spider",
        level: 3,
        stats: { attack: 10, defense: 4, health_points: 50, speed: 12 },
        abilities: ["Strike", "Poison Sting"],
        rewards: { experience: 20, currency: 15, items: ["Spider Silk", "Minor Venom Sac"] }
    },
    // Level 4-7: Intermediate
    {
        name: "Orc Grunt",
        level: 4,
        stats: { attack: 15, defense: 8, health_points: 70, speed: 8 },
        abilities: ["Strike", "Power Attack"],
        rewards: { experience: 30, currency: 25, items: ["Orc Tooth", "Crude Axe"] }
    },
    {
        name: "Wild Boar",
        level: 5,
        stats: { attack: 18, defense: 6, health_points: 60, speed: 20 },
        abilities: ["Strike", "Power Attack"], // Re-using Power Attack, or a "Charge" ability
        rewards: { experience: 35, currency: 20, items: ["Boar Tusk", "Tough Hide"] }
    },
    {
        name: "Bandit Thug",
        level: 6,
        stats: { attack: 20, defense: 10, health_points: 80, speed: 18 },
        abilities: ["Strike", "Guard Up", "Quick Heal"],
        rewards: { experience: 40, currency: 30, items: ["Bandit Mask", "Stolen Pouch"] }
    },
    {
        name: "Rock Golem Fragment",
        level: 7,
        stats: { attack: 12, defense: 20, health_points: 100, speed: 5 },
        abilities: ["Strike", "Guard Up"], // Guard up or a similar defensive ability
        rewards: { experience: 50, currency: 35, items: ["Stone Shard", "Earth Crystal Fragment"] }
    },
    // Level 8-12: Advanced
    {
        name: "Shadow Lurker",
        level: 8,
        stats: { attack: 25, defense: 12, health_points: 90, speed: 25 },
        abilities: ["Strike", "Poison Sting", "Weaken"], // Assuming Weaken exists
        rewards: { experience: 60, currency: 50, items: ["Shadow Essence", "Dark Cloak Scrap"] }
    },
    {
        name: "Fire Elemental Spawn",
        level: 9,
        stats: { attack: 30, defense: 15, health_points: 110, speed: 15 },
        abilities: ["Strike", "Fireball"], // Assuming Fireball exists
        rewards: { experience: 70, currency: 60, items: ["Fiery Core", "Charred Ember"] }
    },
    {
        name: "Forest Guardian Spirit",
        level: 10,
        stats: { attack: 28, defense: 18, health_points: 120, speed: 18 },
        abilities: ["Strike", "Heal", "Regeneration Boost"], // Assuming Heal and Regen Boost exist
        rewards: { experience: 85, currency: 70, items: ["Ancient Bark", "Spirit Bloom"] }
    },
    {
        name: "Ice Wraith",
        level: 11,
        stats: { attack: 32, defense: 16, health_points: 100, speed: 22 },
        abilities: ["Strike", "Weaken"], // Assuming an ice-themed attack like "Ice Shard" or just Strike
        rewards: { experience: 90, currency: 75, items: ["Frozen Shard", "Icy Ectoplasm"] }
    },
    {
        name: "Desert Nomad Warrior",
        level: 12,
        stats: { attack: 35, defense: 20, health_points: 130, speed: 20 },
        abilities: ["Strike", "Power Attack", "Guard Up"],
        rewards: { experience: 100, currency: 80, items: ["Nomad's Scimitar Fragment", "Desert Cloth"] }
    },
    // Level 13-15: Elite
    {
        name: "Miniature Dragon Whelp",
        level: 13,
        stats: { attack: 40, defense: 22, health_points: 150, speed: 25 },
        abilities: ["Strike", "Fireball", "Power Attack"], // Assuming a breath attack or strong strike
        rewards: { experience: 120, currency: 100, items: ["Dragon Scale Fragment", "Whelp Claw"] }
    },
    {
        name: "Elite Orc Berserker",
        level: 14,
        stats: { attack: 45, defense: 18, health_points: 140, speed: 28 },
        abilities: ["Power Attack", "Berserk"], // Berserk for high damage, low defense
        rewards: { experience: 130, currency: 110, items: ["Orc Warchief's Crest", "Heavy Axe"] }
    },
    {
        name: "Arcane Construct",
        level: 15,
        stats: { attack: 38, defense: 25, health_points: 160, speed: 15 },
        abilities: ["Strike", "Defensive Stance", "Fireball"], // Assuming Defensive Stance exists
        rewards: { experience: 150, currency: 120, items: ["Arcane Core", "Enchanted Plate"] }
    }
];


const seedAiOpponents = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for seeder...');

        // Clear existing AI opponents
        await AiOpponent.deleteMany({});
        console.log('Existing AI Opponents cleared.');

        // Insert new AI opponents
        await AiOpponent.insertMany(aiOpponentsData);
        console.log('AI Opponents seeded successfully!');

    } catch (error) {
        console.error('Error seeding AI Opponents:', error.message);
        process.exitCode = 1; // Indicate an error
    } finally {
        await closeDB();
        console.log('MongoDB connection closed.');
    }
};

// Allow running the seeder directly from CLI
if (require.main === module) {
    seedAiOpponents();
}

module.exports = seedAiOpponents;
