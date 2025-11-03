import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicantOnboardingPage from "./components/ApplicantOnboardingPage";
import TestInstructions from "./components/TestInstructions";
import TestPage from "./components/TestPage";
import CompletedTestPage from "./components/CompletedTestPage";
import TestProgress from "./components/TestProgress";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ApplicantOnboardingPage />} />
        <Route path="/instructions" element={<TestInstructions />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/CompletedTest" element={<CompletedTestPage />} />
        <Route path="/TestProgress" element={<TestProgress />} />

        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
