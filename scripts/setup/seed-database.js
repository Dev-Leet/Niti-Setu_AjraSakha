const mongoose = require('mongoose');
const { Scheme } = require('../../server/dist/models/Scheme.model');
const { mockSchemes } = require('../../server/dist/tests/fixtures/schemes');

async function seedDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  await Scheme.deleteMany({});
  await Scheme.insertMany(mockSchemes);
  
  console.log(`✓ Seeded ${mockSchemes.length} schemes`);
  await mongoose.disconnect();
}

seedDatabase().catch(console.error);