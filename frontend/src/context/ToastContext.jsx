import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

const ICONS = {
  success: { icon: CheckCircle, color: 'text-green-500',  bg: 'bg-white', bar: 'bg-green-500'  },
  error:   { icon: XCircle,     color: 'text-red-500',    bg: 'bg-white', bar: 'bg-red-500'    },
  info:    { icon: AlertCircle, color: 'text-blue-500',   bg: 'bg-white', bar: 'bg-blue-500'   },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => {
          const cfg  = ICONS[t.type] || ICONS.success;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 min-w-[280px] max-w-[360px] animate-slide-up overflow-hidden relative"
            >
              {/* Barre colorée à gauche */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />

              <Icon size={20} className={`flex-shrink-0 mt-0.5 ${cfg.color}`} />

              <p className="flex-1 text-sm text-gray-700 font-medium leading-snug">{t.message}</p>

              <button
                onClick={() => remove(t.id)}
                className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
