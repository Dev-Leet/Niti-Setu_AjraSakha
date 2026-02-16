from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
import hashlib
import time
from functools import lru_cache

app = Flask(__name__)

model = SentenceTransformer('all-MiniLM-L6-v2')

embedding_cache = {}
CACHE_MAX_SIZE = 1000
cache_hits = 0
cache_misses = 0

def get_cache_key(text):
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def cache_embedding(text, embedding):
    global embedding_cache
    if len(embedding_cache) >= CACHE_MAX_SIZE:
        oldest_key = next(iter(embedding_cache))
        del embedding_cache[oldest_key]
    
    embedding_cache[get_cache_key(text)] = embedding.tolist()

def get_cached_embedding(text):
    global cache_hits, cache_misses
    key = get_cache_key(text)
    if key in embedding_cache:
        cache_hits += 1
        return embedding_cache[key]
    cache_misses += 1
    return None

@app.route('/embed', methods=['POST'])
def embed_text():
    try:
        data = request.json
        texts = data.get('texts', [])
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        if len(texts) > 100:
            return jsonify({'error': 'Batch size exceeds limit of 100'}), 400
        
        embeddings = []
        uncached_texts = []
        uncached_indices = []
        
        for i, text in enumerate(texts):
            cached = get_cached_embedding(text)
            if cached is not None:
                embeddings.append(cached)
            else:
                embeddings.append(None)
                uncached_texts.append(text)
                uncached_indices.append(i)
        
        if uncached_texts:
            new_embeddings = model.encode(uncached_texts, batch_size=32, show_progress_bar=False)
            
            for i, idx in enumerate(uncached_indices):
                embeddings[idx] = new_embeddings[i].tolist()
                cache_embedding(uncached_texts[i], new_embeddings[i])
        
        return jsonify({
            'embeddings': embeddings,
            'cache_hit_rate': cache_hits / (cache_hits + cache_misses) if (cache_hits + cache_misses) > 0 else 0
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/embed/single', methods=['POST'])
def embed_single():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        cached = get_cached_embedding(text)
        if cached is not None:
            return jsonify({'embedding': cached, 'cached': True})
        
        embedding = model.encode([text], show_progress_bar=False)[0]
        cache_embedding(text, embedding)
        
        return jsonify({'embedding': embedding.tolist(), 'cached': False})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'cache_size': len(embedding_cache),
        'cache_hits': cache_hits,
        'cache_misses': cache_misses,
        'cache_hit_rate': cache_hits / (cache_hits + cache_misses) if (cache_hits + cache_misses) > 0 else 0
    })

@app.route('/cache/clear', methods=['POST'])
def clear_cache():
    global embedding_cache, cache_hits, cache_misses
    embedding_cache.clear()
    cache_hits = 0
    cache_misses = 0
    return jsonify({'status': 'cache cleared'})

if __name__ == '__main__':
    print("Loading sentence-transformers model...")
    print(f"Model: {model}")
    app.run(host='0.0.0.0', port=5001, threaded=True)