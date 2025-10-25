import { createContext, ReactNode, useContext, useState } from "react"

type LoadingContextType = {
    loading: boolean,
    setLoadingStatus: (status?: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);

    const setLoadingStatus = (status?: boolean) => {
        if (typeof status === "boolean") {
            setLoading(status);
        } else {
            setLoading((prev) => !prev);
        }
    }

    return (
        <LoadingContext.Provider value={{ loading, setLoadingStatus }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useAnalysis must be used inside AnalysisProvider");
    return context;
}

