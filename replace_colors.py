import os

REPLACEMENTS = {
    "bg-slate-900": "bg-[#5832E5]",
    "hover:bg-slate-800": "hover:bg-[#4623C2]",
    "shadow-slate-900/10": "shadow-[#5832E5]/10",
    "shadow-slate-900/20": "shadow-[#5832E5]/20",
    "bg-[#141416]": "bg-[#5832E5]",
    "hover:bg-black": "hover:bg-[#4623C2]",
}

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = content
                for old, new in REPLACEMENTS.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

process_directory("/Users/ivane/Downloads/CHAPLAB/CHAPLABO1/src")
