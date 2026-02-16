#!/bin/bash

echo "=== MongoDB Atlas Vector Search Index Verification ==="
echo

if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI environment variable not set"
    exit 1
fi

echo "Checking MongoDB connection..."
mongosh "$MONGODB_URI" --eval "db.runCommand({ ping: 1 })" --quiet

if [ $? -ne 0 ]; then
    echo "✗ MongoDB connection failed"
    exit 1
fi

echo "✓ MongoDB connection successful"
echo

echo "Checking for vector search index..."
mongosh "$MONGODB_URI" --eval "
    db.schemechunks.aggregate([
        { \$listSearchIndexes: {} }
    ]).forEach(idx => {
        if (idx.name === 'scheme_vector_index') {
            print('✓ Vector search index found: ' + idx.name);
            print('  Status: ' + idx.status);
        }
    })
" --quiet

echo
echo "To create the index manually:"
echo "1. Go to MongoDB Atlas dashboard"
echo "2. Navigate to your cluster > Search"
echo "3. Click 'Create Search Index'"
echo "4. Select 'JSON Editor'"
echo "5. Paste content from: server/atlas-setup/vector-index.json"
echo "6. Set database: niti-setu, collection: schemechunks"