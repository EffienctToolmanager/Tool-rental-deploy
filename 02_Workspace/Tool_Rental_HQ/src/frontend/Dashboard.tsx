import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBox, FiUser, FiCalendar, FiMapPin, FiCamera, 
  FiCheckCircle, FiChevronRight, FiRefreshCw 
} from 'react-icons/fi';

/**
 * ✨ Elite Design System 적용: Tool Rental Dashboard Prototype
 * Philosophy: Apple (Minimalism) + Toss (Intuitive UX)
 */

const Dashboard: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // MS Graph API를 통한 SharePoint 데이터 동기화 (인터페이스 skeleton)
  const syncWithSharePoint = async () => {
    console.log("Connecting to MS Graph API: sites/{site-id}/lists/Tool_Rental_Records");
    // TODO: Graph API Authentication & Fetch Logic
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans selection:bg-blue-100">
      {/* Header: Apple-style Sticky Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Tool Rental HQ</h1>
          <button 
            onClick={syncWithSharePoint}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Hero Section: Toss-style Bold Text */}
        <section className="space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold tracking-tight leading-tight"
          >
            대여가 필요하신가요? <br />
            <span className="text-[#3182F6]">간편하게 신청하세요.</span>
          </motion.h2>
        </section>

        {/* Quick Rental Form: Elite Card Design */}
        <section>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputGroup label="장비 고유 코드" icon={<FiBox />} placeholder="예: DSP01" />
                <InputGroup label="프로젝트 명" icon={<FiMapPin />} placeholder="신규 투입 현장 입력" />
              </div>
              <div className="space-y-6">
                <InputGroup label="반납 예정일" icon={<FiCalendar />} type="date" />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#4E5968] ml-1">상태 사진 첨부</label>
                  <button className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-all group">
                    <FiCamera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">클릭하여 사진 업로드</span>
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 bg-[#3182F6] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-[#1b64da] transition-colors flex items-center justify-center space-x-2"
            >
              <span>대여 신청하기</span>
              <FiChevronRight />
            </motion.button>
          </motion.div>
        </section>

        {/* Status Tracker: Minimalist List */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold ml-1 text-[#4E5968]">현재 대여중인 장비</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#3182F6]">
                    <FiBox className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">DSP0{i} (Control System)</div>
                    <div className="text-sm text-[#4E5968]">반납 D-5 | 김태규</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#3182F6] bg-blue-50 px-3 py-1 rounded-full">대여중</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-[#4E5968] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3182F6] transition-colors">
        {icon}
      </div>
      <input 
        className="w-full bg-[#F9FAFB] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#3182F6] transition-all outline-none placeholder:text-gray-300"
        {...props}
      />
    </div>
  </div>
);

export default Dashboard;
