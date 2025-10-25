import './App.css';
import ThemedToggle from './components/ThemedToggle';
import Header from './components/Header';
import Tabs from './components/Tabs';
import DrugAnalysis from './components/DrugAnalysis';
import SentenceAnalysis from './components/SentenceAnalysis';
import ResultDrugAnalysis from './components/ResultDrugAnalysis';
import ResultSentenceAnalysis from './components/ResultSentenceAnalysis';
import { AnalysisProvider } from './context/AnalysisContext';
import { LoadingProvider } from './context/LoadingContext';
import Loading from './components/Loading';
import RoutesIndex from './routes';

function App() {
  return (
    <LoadingProvider>
      <AnalysisProvider>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-[#282c34] dark:text-gray-100 flex items-center flex-col p-11">
          <Loading />
          <ThemedToggle />
          <RoutesIndex />
        </div>
      </AnalysisProvider>
    </LoadingProvider>
  );
}

export default App;
