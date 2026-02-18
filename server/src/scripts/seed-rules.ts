import mongoose from 'mongoose';
import { EligibilityRule } from '../models/EligibilityRule.model.js';
import { Scheme } from '../models/Scheme.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niti-setu';

async function seedRules() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const schemes = await Scheme.find();

  if (schemes.length === 0) {
    console.log('No schemes found. Run scheme ingestion first.');
    process.exit(1);
  }

  for (const scheme of schemes) {
    const existingRule = await EligibilityRule.findOne({ schemeId: scheme._id.toString() });

    if (existingRule) {
      console.log(`Rule exists for: ${scheme.name.en}`);
      continue;
    }

    const defaultRules = [
      { field: 'landholding', operator: 'lte', value: 10 },
      { field: 'state', operator: 'in', value: ['Punjab', 'Haryana', 'UP', 'Maharashtra', 'Karnataka'] },
    ];

    await EligibilityRule.create({
      schemeId: scheme._id.toString(),
      rules: defaultRules,
    });

    console.log(`Created rule for: ${scheme.name.en}`);
  }

  await mongoose.disconnect();
  console.log('\nRules seeded successfully');
}

seedRules().catch(console.error);