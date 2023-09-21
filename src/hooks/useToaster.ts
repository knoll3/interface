import { useState } from 'react';

export interface IToast {
    id: number,
    content: IToastContent
}

export type IToastContent = {
  type: string;
  title: string;
  message: string;
};


export default function useToaster() {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (content: IToastContent) => {
    const toast = { id: Date.now(), content };
    setToasts((prevToasts) => [...prevToasts, toast]);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts: IToast[]) =>
      prevToasts.filter((toast: IToast) => toast.id !== id)
    );
  };

  return { toasts, addToast };
}
