const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  console.log('Running migrations...');
  
  await mongoose.connection.db.collection('users').updateMany(
    { version: { $exists: false } },
    { $set: { version: 1 } }
  );
  
  console.log('✓ Migrations complete');
  await mongoose.disconnect();
}

migrate().catch(console.error);