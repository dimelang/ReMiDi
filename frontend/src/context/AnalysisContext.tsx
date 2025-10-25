import { createContext, ReactNode, useContext, useState } from "react";

type AnalysisContextType = {
    drugResult: any,
    sentenceResult: any,
    setDrugResult: (data: any) => void,
    setSentenceResult: (data: any) => void
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [drugResult, setDrugResult] = useState<any>(null);
    const [sentenceResult, setSentenceResult] = useState<any>(null);

    return (
        <AnalysisContext.Provider value={{ drugResult, sentenceResult, setDrugResult, setSentenceResult }}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (!context) throw new Error("useAnalysis must be used inside AnalysisProvider");
    return context;
}