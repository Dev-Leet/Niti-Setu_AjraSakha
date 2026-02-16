import os
import sys

def check_requirements():
    checks = {
        'sentence-transformers': False,
        'torch': False,
        'llama-cpp-python': False,
        'flask': False,
    }
    
    for package in checks.keys():
        try:
            __import__(package.replace('-', '_'))
            checks[package] = True
        except ImportError:
            pass
    
    return checks

def check_model_file():
    model_path = './models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf'
    exists = os.path.exists(model_path)
    
    if exists:
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        return {'exists': True, 'size_mb': round(size_mb, 2)}
    
    return {'exists': False, 'size_mb': 0}

def main():
    print("=== ML Services Setup Check ===\n")
    
    print("Python Version:", sys.version.split()[0])
    print()
    
    print("Required Packages:")
    packages = check_requirements()
    for package, installed in packages.items():
        status = "✓ Installed" if installed else "✗ Missing"
        print(f"  {package}: {status}")
    
    print()
    print("Model File:")
    model_info = check_model_file()
    if model_info['exists']:
        print(f"  ✓ TinyLlama model found ({model_info['size_mb']} MB)")
    else:
        print("  ✗ TinyLlama model not found")
        print("  Run: bash download_model.sh")
    
    print()
    
    all_packages_ok = all(packages.values())
    model_ok = model_info['exists']
    
    if all_packages_ok and model_ok:
        print("✓ All checks passed! Ready to start ML services.")
        return 0
    else:
        print("✗ Setup incomplete. Please install missing dependencies.")
        return 1

if __name__ == '__main__':
    sys.exit(main())