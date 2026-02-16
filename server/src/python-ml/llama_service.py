from flask import Flask, request, jsonify
from llama_cpp import Llama
import os

app = Flask(__name__)

MODEL_PATH = os.getenv('LLAMA_MODEL_PATH', './models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf')

llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=2048,
    n_threads=4,
    n_batch=512,
    n_gpu_layers=0,
    verbose=False,
)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        max_tokens = data.get('max_tokens', 150)
        temperature = data.get('temperature', 0.7)
        
        output = llm(
            prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=0.9,
            stop=["</s>", "\n\n"],
            echo=False,
        )
        
        response_text = output['choices'][0]['text'].strip()
        
        return jsonify({
            'response': response_text,
            'tokens_used': output['usage']['completion_tokens']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': llm is not None})

if __name__ == '__main__':
    print(f"Loading model from: {MODEL_PATH}")
    app.run(host='0.0.0.0', port=5002, threaded=True)