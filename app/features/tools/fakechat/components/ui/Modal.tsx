import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    titleClassName?: string;
    headerClassName?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    titleClassName,
    headerClassName,
    children,
    showCloseButton = true,
    maxWidth = 'md'
}) => {
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

                {/* Modal Content */}
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
                            <DialogPanel
                                className={`bg-slate-900 rounded-2xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl overflow-hidden border border-white/10`}>
                                {title && (
                                    <div className={`p-6 flex justify-between items-start ${headerClassName ?? ''}`}>
                                        <DialogTitle as="div" className={titleClassName}>
                                            {title}
                                        </DialogTitle>
                                        {showCloseButton && (
                                            <button
                                                onClick={onClose}
                                                className="text-white/80 hover:text-white transition cursor-pointer">
                                                <X size={24} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
