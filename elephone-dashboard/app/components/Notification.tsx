"use client";

import { Check, AlertCircle, Zap, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const icons = {
    success: Check,
    error: AlertCircle,
    info: Zap
  };

  const colors = {
    success: {
      bg: 'from-[#10B98120] to-[#1E293B]',
      border: 'border-[#10B981]',
      icon: 'text-[#10B981]'
    },
    error: {
      bg: 'from-[#EF444420] to-[#1E293B]',
      border: 'border-[#EF4444]',
      icon: 'text-[#EF4444]'
    },
    info: {
      bg: 'from-[#0EA5E920] to-[#1E293B]',
      border: 'border-[#0EA5E9]',
      icon: 'text-[#0EA5E9]'
    }
  };

  const Icon = icons[type];
  const color = colors[type];

  return (
    <div className={`
      fixed top-6 right-6 z-50
      flex items-center gap-3 px-6 py-4
      bg-gradient-to-r ${color.bg}
      border ${color.border}
      rounded-xl shadow-2xl
      animate-slideInRight
      min-w-[320px] max-w-[480px]
    `}>
      <Icon size={20} className={color.icon} />
      <span className="flex-1 text-[#F1F5F9] text-[15px]">{message}</span>
      <button
        onClick={onClose}
        className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
