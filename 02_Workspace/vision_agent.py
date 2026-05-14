import os
import time
import base64
import shutil
import requests
from pathlib import Path
from watchdog.observers.polling import PollingObserver # 구글 드라이브 인식을 위해 Polling으로 변경
from watchdog.events import FileSystemEventHandler

# ==========================================
# 1. 환경 및 경로 설정 (옵시디언 환경 맞춤형)
# ==========================================
OLLAMA_API_URL = "http://localhost:11434/api/generate"

BASE_DIR = r"g:\내 드라이브\Family_Archive\위키 에이전트"

# 경로 A: 업무/행정용 (Moondream)
DIR_ADMIN = os.path.join(BASE_DIR, "00_Raw", "Admin")
DIR_OUTPUT = os.path.join(BASE_DIR, "00_Raw", "Admin", "Data")

# 경로 B: 개인/지식용 (LLaVA) - 00_Raw 자체를 Input으로 사용
DIR_STUDY = os.path.join(BASE_DIR, "00_Raw")
DIR_VAULT = os.path.join(BASE_DIR, "00_Raw")

# 공통 아카이브 (분석 완료된 원본 이미지)
DIR_ARCHIVE = os.path.join(BASE_DIR, "00_Raw", "Archive")

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}

def ensure_directories():
    directories = [DIR_ADMIN, DIR_OUTPUT, DIR_STUDY, DIR_VAULT, DIR_ARCHIVE]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

# ==========================================
# 2. Ollama API 연동 모듈
# ==========================================
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_image_with_ollama(model_name, prompt, image_path):
    print(f"\n[AI Engine] '{model_name}' 모델을 활용해 분석을 시작합니다... (대상: {os.path.basename(image_path)})")
    
    base64_image = encode_image(image_path)
    
    payload = {
        "model": model_name,
        "prompt": prompt,
        "images": [base64_image],
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        return response.json().get('response', '')
    except requests.exceptions.RequestException as e:
        print(f"[Error] Ollama API 호출 중 오류 발생: {e}")
        return None

# ==========================================
# 3. 파일 감시 및 처리 핸들러
# ==========================================
class ImageVisionHandler(FileSystemEventHandler):
    
    def on_created(self, event):
        if not event.is_directory:
            self._handle_file(event.src_path)
            
    def on_moved(self, event):
        # 구글 드라이브 동기화 과정에서 임시 파일이 원본 이름으로 변경될 때 감지
        if not event.is_directory:
            self._handle_file(event.dest_path)

    def _handle_file(self, file_path):
        ext = Path(file_path).suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            return
            
        time.sleep(2) # 파일이 완전히 복사되거나 동기화될 때까지 대기
        
        parent_dir = os.path.dirname(file_path).lower()
        filename = os.path.basename(file_path)
        file_stem = os.path.splitext(filename)[0]
        
        try:
            if parent_dir == DIR_ADMIN.lower():
                self.process_admin_task(file_path, file_stem)
            elif parent_dir == DIR_STUDY.lower():
                self.process_study_task(file_path, file_stem)
            else:
                return
            
            archive_path = os.path.join(DIR_ARCHIVE, filename)
            if os.path.exists(archive_path):
                archive_path = os.path.join(DIR_ARCHIVE, f"{file_stem}_{int(time.time())}{ext}")
                
            shutil.move(file_path, archive_path)
            print(f"[Move] 처리 완료. 원본 파일 아카이브로 이동됨: {archive_path}\n")
            
        except Exception as e:
            print(f"[Error] 파일({filename}) 처리 중 예외 발생: {e}")

    def process_admin_task(self, image_path, file_stem):
        prompt = (
            "Analyze the receipt in the image carefully and extract the store name, purchase date, total amount, and purchased items. "
            "You MUST extract and translate all text into Korean (한국어/한글). Do not use Japanese or Chinese. "
            "You MUST format your response EXACTLY as a valid JSON object. Replace the empty strings and arrays with the actual extracted data. "
            "If a value cannot be found, return null.\n"
            "{\n"
            '  "store_name": "",\n'
            '  "date": "",\n'
            '  "total_amount": "",\n'
            '  "items": []\n'
            "}\n"
            "Return ONLY the raw JSON object. Do not include any Markdown blocks, backticks, or conversational text."
        )
        result_text = analyze_image_with_ollama("minicpm-v", prompt, image_path)
        
        if result_text:
            output_file = os.path.join(DIR_OUTPUT, f"{file_stem}.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(result_text.strip())
            print(f"[Success] Admin 작업 완료. JSON 저장: {output_file}")

    def process_study_task(self, image_path, file_stem):
        prompt = (
            "Analyze this image comprehensively. "
            "Please provide an overall summary, key insights, and actionable takeaways in a well-structured Markdown format."
        )
        result_text = analyze_image_with_ollama("llava", prompt, image_path)
        
        if result_text:
            output_file = os.path.join(DIR_VAULT, f"{file_stem}.md")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(result_text.strip())
            print(f"[Success] Study 작업 완료. Markdown 저장: {output_file}")

def process_existing_files(handler):
    """스크립트 시작 전에 이미 폴더에 들어와 있던 파일들을 스캔하여 처리합니다."""
    print("\n[System] 스크립트 실행 전 폴더에 남아있는 이미지 파일을 스캔합니다...")
    for directory in [DIR_ADMIN, DIR_STUDY]:
        if not os.path.exists(directory): continue
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            if os.path.isfile(file_path) and Path(filename).suffix.lower() in SUPPORTED_EXTENSIONS:
                print(f"[System] 대기 중인 파일 발견: {filename} -> 처리 시작")
                handler._handle_file(file_path)

# ==========================================
# 4. 메인 실행부
# ==========================================
if __name__ == "__main__":
    ensure_directories()
    event_handler = ImageVisionHandler()
    
    # 1. 켜지기 전에 넣어둔 파일 우선 스캔 및 처리
    process_existing_files(event_handler)
    
    # 2. 구글 드라이브(가상 드라이브) 환경에 강한 PollingObserver 사용
    observer = PollingObserver()
    observer.schedule(event_handler, DIR_ADMIN, recursive=False)
    observer.schedule(event_handler, DIR_STUDY, recursive=False)
    
    observer.start()
    print("=========================================================")
    print("🚀 로컬 AI 시각 지능 자동화 시스템 작동 시작")
    print(f"👀 감시 중 [Admin]: {DIR_ADMIN} (Model: MiniCPM-V - JSON 구조화)")
    print(f"👀 감시 중 [Study]: {DIR_STUDY} (Model: LLaVA - Markdown 분석)")
    print("=========================================================")
    print("종료하려면 'Ctrl + C'를 누르세요.\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n감시 시스템을 종료합니다.")
        observer.stop()
        
    observer.join()
