import DrugAnalysis from "../components/DrugAnalysis";
import Header from "../components/Header";
import ResultDrugAnalysis from "../components/ResultDrugAnalysis";
import ResultSentenceAnalysis from "../components/ResultSentenceAnalysis";
import SentenceAnalysis from "../components/SentenceAnalysis";
import Tabs from "../components/Tabs";

export default function MainPage() {
    return (
        <>
            <Header />
            <Tabs tabs={{
                "Analisis Obat": [<DrugAnalysis />, <ResultDrugAnalysis />],
                "Analisis Review": [<SentenceAnalysis />, <ResultSentenceAnalysis />]
            }} />
        </>
    );
}