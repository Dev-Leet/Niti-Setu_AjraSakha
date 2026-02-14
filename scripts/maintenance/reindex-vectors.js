const { Pinecone } = require('@pinecone-database/pinecone');
const mongoose = require('mongoose');
const { PDFDocument } = require('../../server/dist/models/PDFDocument.model');

async function reindex() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pinecone.index(process.env.PINECONE_INDEX);
  
  await index.namespace('').deleteAll();
  
  const documents = await PDFDocument.find({ status: 'completed' });
  
  console.log(`Reindexing ${documents.length} documents...`);
  
  console.log('✓ Reindexing complete');
  await mongoose.disconnect();
}

reindex().catch(console.error);