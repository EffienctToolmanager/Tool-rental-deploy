import os

file_path = r'c:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\deploy_tmp\assets\index-CjqbIfKu.js'
# Short URL doesn't have a '?', so it works with the original dashboard logic (?id=...)
new_url = 'https://forms.office.com/r/HQfa3nDmZu'
placeholder = 'https://forms.office.com/r/yourformid'

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any existing form URL (long or placeholder) with the new short URL
    # We'll look for the base part 'https://forms.office.com/'
    import re
    # Find any URL starting with forms.office.com inside quotes
    pattern = r'https://forms\.office\.com/[^\s"\'`]*'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, new_url, content)
        # Also ensure we are using ?id= (standard) since short URLs don't have ?
        new_content = new_content.replace('&id=${e.colA}', '?id=${e.colA}')
        new_content = new_content.replace('&id=${e[n[0]]}', '?id=${e[n[0]]}')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully updated {file_path} with short URL")
    else:
        print(f"Forms URL pattern not found in {file_path}")
else:
    print(f"File not found: {file_path}")
