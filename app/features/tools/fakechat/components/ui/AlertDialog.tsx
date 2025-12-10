import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

type AlertType = 'warning' | 'info' | 'error' | 'success';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
    type?: AlertType;
}

const iconMap = {
    warning: AlertTriangle,
    info: Info,
    error: AlertCircle,
    success: CheckCircle
};

const iconColorMap = {
    warning: 'text-amber-400 bg-amber-500/10',
    info: 'text-tech-400 bg-tech-500/10',
    error: 'text-red-400 bg-red-500/10',
    success: 'text-emerald-400 bg-emerald-500/10'
};

const buttonColorMap = {
    warning: 'bg-amber-600 hover:bg-amber-700 border-amber-500/30',
    info: 'bg-tech-600 hover:bg-tech-700 border-tech-500/30',
    error: 'bg-red-600 hover:bg-red-700 border-red-500/30',
    success: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/30'
};

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    onClose,
    title,
    message,
    buttonText = 'OK',
    type = 'info'
}) => {
    const Icon = iconMap[type];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </TransitionChild>

                {/* Dialog Content */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <DialogPanel className="bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-white/10 p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`p-3 rounded-full mb-4 ${iconColorMap[type]}`}>
                                        <Icon size={24} />
                                    </div>
                                    <DialogTitle as="h3" className="text-lg font-semibold text-white mb-2">
                                        {title}
                                    </DialogTitle>
                                    <p className="text-sm text-slate-400 mb-6">{message}</p>

                                    <button
                                        onClick={onClose}
                                        className={`w-full py-2.5 rounded-xl text-white transition font-medium border ${buttonColorMap[type]}`}>
                                        {buttonText}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AlertDialog;
