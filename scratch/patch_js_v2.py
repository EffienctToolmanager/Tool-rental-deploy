import os

file_path = r'c:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\deploy_tmp\assets\index-CjqbIfKu.js'

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Ensure the URL is correct
    url = 'https://forms.office.com/Pages/ResponsePage.aspx?id=0bbMFTXTlkm2-XtpJfCBIYcZG22FI4NKt0EK7qOu0vRUMllQUTVSOUEwNFI5UElWUlRBWDM5RUxZRy4u'
    # We also need to fix the separator from ?id= to &id= because the base URL already has a ?
    # In the minified JS, it looks like `${u}?id=${e.colA}` or similar.
    
    # Replace the base URL if needed (it should already be correct from last time)
    # Then find the part where it appends ?id= and change to &id=
    
    new_content = content.replace('?id=${e.colA}', '&id=${e.colA}')
    new_content = new_content.replace('?id=${e[n[0]]}', '&id=${e[n[0]]}') # For another potential version
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully patched {file_path}")
else:
    print(f"File not found: {file_path}")
