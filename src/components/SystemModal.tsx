import React from 'react';
import { X } from 'lucide-react';
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showModal: (params: Omit<ModalState, 'isOpen' | 'showModal' | 'hideModal'>) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  showModal: (params) => set({ isOpen: true, ...params }),
  hideModal: () => set({ isOpen: false }),
}));

export function SystemModal() {
  const { isOpen, title, message, type, confirmLabel, cancelLabel, onConfirm, onCancel, hideModal } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  const colors = {
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={hideModal}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className={`p-4 ${colors[type]}`}>
          <p>{message}</p>
        </div>

        {(confirmLabel || cancelLabel) && (
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            {cancelLabel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {cancelLabel}
              </button>
            )}
            {confirmLabel && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}