import os
import re

WIKI_DIR = r"C:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\10_Wiki"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Category 경로 제거 [[10_Wiki/Path/To]] -> [[To]]
    content = re.sub(r'category: "\[\[10_Wiki/.*?/(.*?)\]\]"', r'category: "[[\1]]"', content)
    
    # 2. Parent 경로 제거 - **Parent:** [[10_Wiki/Path/To]] -> - **Parent:** [[To]]
    content = re.sub(r'- \*\*Parent:\*\* \[\[10_Wiki/.*?/(.*?)\]\]', r'- **Parent:** [[\1]]', content)
    
    # 3. Raw Source 경로 제거 [[00_Raw/filename]] -> [[filename]]
    content = re.sub(r'- \*\*Raw Source:\*\* \[\[00_Raw/(.*?)\]\]', r'- **Raw Source:** [[\1]]', content)
    
    # 4. Tags 형식 변환 [tag1, tag2] -> 리스트
    def tag_replacer(match):
        tags_raw = match.group(1)
        tags = [t.strip() for t in tags_raw.split(',')]
        new_tags = "\ntags:\n" + "\n".join([f"  - {t}" for t in tags])
        return new_tags
        
    content = re.sub(r'tags: \[(.*?)\]', tag_replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def walk_and_fix():
    for root, dirs, files in os.walk(WIKI_DIR):
        for file in files:
            if file.endswith('.md'):
                print(f"Fixing: {file}")
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_and_fix()
    print("All wiki files have been optimized for Obsidian Graph View!")
