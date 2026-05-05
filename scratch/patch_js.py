import os

file_path = r'c:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\deploy_tmp\assets\index-CjqbIfKu.js'
old_url = 'https://forms.office.com/r/yourformid'
new_url = 'https://forms.office.com/Pages/ResponsePage.aspx?id=0bbMFTXTlkm2-XtpJfCBIYcZG22FI4NKt0EK7qOu0vRUMllQUTVSOUEwNFI5UElWUlRBWDM5RUxZRy4u'

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_url in content:
        new_content = content.replace(old_url, new_url)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully updated {file_path}")
    else:
        print(f"URL not found in {file_path}")
else:
    print(f"File not found: {file_path}")
