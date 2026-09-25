import re

file_path = '/Users/ivane/Downloads/CHAPLAB/CHAPLABO1/src/components/print/ReportPrintModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# We only want to replace inside renderExamResults and the print-report-content div.
# But replacing globally in this file is perfectly fine since the modal is only used for printing.
# Wait, the modal UI (ZONE VISIBLE) also has these colors! 
# Let's just replace globally in this file to be safe because html2canvas might read the whole document? 
# No, html2canvas only clones the target element. 
# But it's easier to replace everywhere in the file.

color_map = {
    'slate-50': '#F8FAFC',
    'slate-100': '#F1F5F9',
    'slate-200': '#E2E8F0',
    'slate-300': '#CBD5E1',
    'slate-400': '#94A3B8',
    'slate-500': '#64748B',
    'slate-600': '#475569',
    'slate-700': '#334155',
    'slate-800': '#1E293B',
    'slate-900': '#0F172A',
    
    'purple-50': '#FAF5FF',
    'purple-200': '#E9D5FF',
    'purple-800': '#6B21A8',
    'purple-900': '#581C87',
    'purple-950': '#3B0764',
    
    'blue-300': '#93C5FD',
    'blue-800': '#1E40AF',
    'blue-900': '#1E3A8A',
    
    'emerald-700': '#047857',
}

new_content = content
for name, hex_val in color_map.items():
    # Replace text-slate-50 with text-[#F8FAFC]
    new_content = re.sub(rf'\btext-{name}\b', f'text-[{hex_val}]', new_content)
    # Replace bg-slate-50 with bg-[#F8FAFC]
    new_content = re.sub(rf'\bbg-{name}(?!/)', f'bg-[{hex_val}]', new_content)
    # Replace bg-slate-50/40 with bg-[#F8FAFC]/40
    new_content = re.sub(rf'\bbg-{name}/(\d+)\b', f'bg-[{hex_val}]/$1', new_content)
    # Replace border-slate-50 with border-[#F8FAFC]
    new_content = re.sub(rf'\bborder-{name}\b', f'border-[{hex_val}]', new_content)
    # Replace border-b-slate-50 with border-b-[#F8FAFC]
    new_content = re.sub(rf'\bborder-b-{name}\b', f'border-b-[{hex_val}]', new_content)
    # Replace border-l-slate-50 with border-l-[#F8FAFC]
    new_content = re.sub(rf'\bborder-l-{name}\b', f'border-l-[{hex_val}]', new_content)

with open(file_path, 'w') as f:
    f.write(new_content)

print("Colors updated successfully.")
