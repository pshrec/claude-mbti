import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LandingPage,
  TestPage,
  LoadingPage,
  ResultPage,
  StatsPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result/:type" element={<ResultPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
