import { useLoading } from "../context/LoadingContext";

export default function Loading() {
    const { loading, setLoadingStatus } = useLoading();
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                {/* Spinner */}
                <div className="relative flex justify-center items-center">
                    {/* Outer ring */}
                    <div className="w-16 h-16 border-4 border-transparent border-t-[#06b6d4] rounded-full animate-spin"></div>

                    {/* Inner pulse */}
                    <div className="absolute w-8 h-8 bg-[#06b6d4]/20 rounded-full animate-ping"></div>
                </div>

                {/* Text below spinner */}
                <p className="mt-6 text-white font-medium text-lg tracking-wide animate-pulse">
                    Menganalisis data...
                </p>
            </div>
        );
    } else {
        return null;
    }
}
