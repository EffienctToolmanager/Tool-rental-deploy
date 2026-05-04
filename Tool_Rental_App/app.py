import streamlit as st
import os
import tempfile
import datetime

# Attempt to import win32com for Outlook
try:
    import win32com.client as win32
    OUTLOOK_AVAILABLE = True
except ImportError:
    OUTLOOK_AVAILABLE = False

st.set_page_config(page_title="Tool Rental App", page_icon="🛠️", layout="centered")

st.title("🛠️ 사내 장비 대여/반납 신청서")
st.markdown("프로젝트에 필요한 장비를 대여하거나 반납할 때 작성하는 폼입니다. 제출 시 Outlook을 통해 승인권자에게 메일이 발송됩니다.")

def get_wiki_tools():
    """위키의 Tools 폴더에서 장비 목록을 동적으로 가져옵니다."""
    tools_path = r"C:\Users\cfpcl\OneDrive\Desktop\Dev_Workspace\위키 에이전트\10_Wiki\Topics\Tools"
    if not os.path.exists(tools_path):
        return ["기본 장비 (위키 연결 필요)"]
    
    tools = []
    for file in os.listdir(tools_path):
        if file.endswith(".md"):
            # 파일명에서 확장자 제거 및 언더바를 공백으로 치환하여 표시
            tool_name = file.replace(".md", "").replace("_", " ")
            tools.append(tool_name)
    return sorted(tools) if tools else ["등록된 장비 없음 (위키 확인)"]

# --- 위키 연동 장비 리스트 ---
EQUIPMENT_LIST = get_wiki_tools()


with st.form("rental_form"):
    st.subheader("1. 기본 정보")
    col1, col2 = st.columns(2)
    with col1:
        borrower_name = st.text_input("반출자 성명", placeholder="홍길동")
        project_name = st.text_input("프로젝트명", placeholder="AI 자동화 시스템 구축")
    with col2:
        approver_email = st.text_input("승인권자 이메일 (수신자)", placeholder="approver@company.com")
        project_code = st.text_input("프로젝트 코드", placeholder="PRJ-2026-001")
        
    purpose = st.text_area("사용 목적", placeholder="현장 테스트 및 클라이언트 데모용")

    st.subheader("2. 장비 및 일정 정보")
    selected_equipments = st.multiselect("필요한 장비 선택", options=EQUIPMENT_LIST)
    
    col3, col4 = st.columns(2)
    with col3:
        checkout_date = st.date_input("반출 날짜", datetime.date.today())
    with col4:
        return_date = st.date_input("예상 반납 일자", datetime.date.today() + datetime.timedelta(days=7))

    st.subheader("3. 상태 증빙 (사진 첨부)")
    st.markdown("반출 전 장비의 상태를 확인할 수 있는 사진을 첨부해 주세요.")
    uploaded_photos = st.file_uploader("사진 파일 업로드", type=["png", "jpg", "jpeg"], accept_multiple_files=True)

    submit_button = st.form_submit_button("📩 승인 요청 메일 발송하기")

if submit_button:
    if not OUTLOOK_AVAILABLE:
        st.error("오류: `pywin32` 라이브러리가 설치되어 있지 않거나 Windows 환경이 아닙니다. Outlook을 연동할 수 없습니다.")
    elif not borrower_name or not approver_email or not selected_equipments:
        st.warning("반출자 성명, 승인권자 이메일, 장비 선택은 필수입니다!")
    else:
        with st.spinner("Outlook 메일을 생성하고 있습니다..."):
            try:
                # 1. Outlook 애플리케이션 연결
                outlook = win32.Dispatch('outlook.application')
                mail = outlook.CreateItem(0)
                
                # 2. 메일 내용 포맷팅
                equip_str = "<ul>" + "".join([f"<li>{e}</li>" for e in selected_equipments]) + "</ul>"
                
                mail.To = approver_email
                mail.Subject = f"[장비대여 승인요청] {project_name} - {borrower_name}"
                
                html_body = f"""
                <html>
                <body>
                    <h2>🛠️ 사내 장비 대여 승인 요청</h2>
                    <p>아래와 같이 장비 대여를 요청하오니 승인 부탁드립니다.</p>
                    <table border="1" style="border-collapse: collapse; width: 100%;">
                        <tr><td style="padding: 8px; background-color: #f2f2f2;"><b>반출자</b></td><td style="padding: 8px;">{borrower_name}</td></tr>
                        <tr><td style="padding: 8px; background-color: #f2f2f2;"><b>프로젝트명</b></td><td style="padding: 8px;">{project_name} ({project_code})</td></tr>
                        <tr><td style="padding: 8px; background-color: #f2f2f2;"><b>사용 목적</b></td><td style="padding: 8px;">{purpose}</td></tr>
                        <tr><td style="padding: 8px; background-color: #f2f2f2;"><b>대여 기간</b></td><td style="padding: 8px;">{checkout_date} ~ {return_date}</td></tr>
                        <tr><td style="padding: 8px; background-color: #f2f2f2;"><b>요청 장비</b></td><td style="padding: 8px;">{equip_str}</td></tr>
                    </table>
                    <p>첨부된 장비 상태 사진을 확인해 주세요.</p>
                </body>
                </html>
                """
                mail.HTMLBody = html_body
                
                # 3. 첨부파일 처리 (임시 폴더에 저장 후 Outlook에 첨부)
                temp_dir = tempfile.gettempdir()
                saved_files = []
                
                for photo in uploaded_photos:
                    temp_path = os.path.join(temp_dir, photo.name)
                    with open(temp_path, "wb") as f:
                        f.write(photo.getbuffer())
                    mail.Attachments.Add(temp_path)
                    saved_files.append(temp_path)
                
                # 4. 메일 발송 (Send: 바로 발송, Display: 창 띄우기)
                # mail.Send() # 사용자가 직접 발송 버튼을 누르게 하려면 아래 Display()를 사용
                mail.Display() 
                
                st.success("✅ Outlook 메일 작성 창이 팝업되었습니다! 내용을 확인하시고 '보내기'를 클릭해 주세요.")
                st.balloons()
                
            except Exception as e:
                st.error(f"메일 생성 중 오류가 발생했습니다: {e}")
