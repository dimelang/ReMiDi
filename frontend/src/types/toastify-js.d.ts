declare module "toastify-js" {
    interface ToastifyOptions {
        text: string;
        duration?: number;
        selector?: string;
        destination?: string;
        newWindow?: boolean;
        close?: boolean;
        gravity?: "top" | "bottom";
        position?: "left" | "center" | "right";
        backgroundColor?: string;
        stopOnFocus?: boolean;
        onClick?: () => void;
        style?: Record<string, string>;
    }

    export default function Toastify(options: ToastifyOptions): {
        showToast: () => void;
    };
}
