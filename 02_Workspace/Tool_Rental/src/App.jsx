import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

function DashboardContent() {
  const { instance, accounts } = useMsal();
  const [tools, setTools] = useState([
    { id: 1, name: "디월트 전동 드릴 20V", status: "Available" },
    { id: 2, name: "보쉬 레이저 레벨기", status: "Rented" }
  ]);

  const handleLogin = () => {
    instance.loginPopup({
      scopes: ["User.Read", "Sites.ReadWrite.All"]
    }).catch(e => console.error(e));
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(e => console.error(e));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">공구 대여 시스템</h1>
            <p className="text-slate-500 mt-2">현장 장비 요청 및 반납을 직관적으로 관리하세요.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <AuthenticatedTemplate>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{accounts[0]?.name}님</p>
                <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-red-500 transition-colors">로그아웃</button>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {accounts[0]?.name?.charAt(0)}
              </div>
            </AuthenticatedTemplate>
            
            <UnauthenticatedTemplate>
              <button 
                onClick={handleLogin}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                MS 계정으로 로그인
              </button>
            </UnauthenticatedTemplate>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {tools.map(tool => (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              key={tool.id} 
              className="p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold">{tool.name}</h3>
              <div className="mt-6 flex items-center justify-between">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${tool.status === 'Available' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {tool.status === 'Available' ? '대여 가능' : '대여 중'}
                </span>
                <button 
                  disabled={tool.status === 'Rented'}
                  className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  신청하기
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <DashboardContent />
    </MsalProvider>
  );
}

