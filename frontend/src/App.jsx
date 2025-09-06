import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
import LessonDetail from "./pages/LessonDetail";  // 👈 import new page
import AlphabetMid from "./pages/AlphabetMid";
import AlphabetHigh from "./pages/AlphabetHigh";
import AlphabetLow from "./pages/AlphabetLow";
import AlphabetIndex from "./pages/AlphabetIndex";
import WordsIndex from "./pages/WordsIndex";
import PhrasesIndex from "./pages/PhrasesIndex";



export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:slug" element={<LessonDetail />} /> {/* 👈 dynamic route */}
        <Route path="alphabet" element={<AlphabetIndex />} />
        <Route path="alphabet/mid" element={<AlphabetMid />} />
        <Route path="alphabet/high" element={<AlphabetHigh />} />
        <Route path="alphabet/low" element={<AlphabetLow />} />
        <Route path="words" element={<WordsIndex />} />
        <Route path="phrases" element={<PhrasesIndex />} />
        <Route path="progress" element={<Progress />} />
      </Route>
    </Routes>
  );
}
