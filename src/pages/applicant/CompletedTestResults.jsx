import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Clock,
  FileText,
  AlertCircle,
  Award,
} from "lucide-react";
import Footer from "../../components/applicant/Footer";

const CompletedTestResults = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [detailedResults, setDetailedResults] = useState([]);

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    loadAndSaveResults();
  }, []);

  const loadAndSaveResults = async () => {
    try {
      const results = JSON.parse(localStorage.getItem("testResults") || "null");
      const applicantData = JSON.parse(
        localStorage.getItem("applicantData") || "{}"
      );

      if (!results) {
        alert("No test results found. Redirecting...");
        navigate("/");
        return;
      }

      if (!results.quizData || !results.quizData.quiz_id) {
        console.error("Quiz data is missing or invalid");
        setSaveError("Invalid quiz data");
        setTestResults(results);
        setLoading(false);
        return;
      }

      setTestResults(results);
      setLoading(false);
      await saveResultsToBackend(results, applicantData);
    } catch (error) {
      console.error("Error loading results:", error);
      setSaveError(error.message);
      setLoading(false);
    }
  };

  const saveResultsToBackend = async (results, applicantData) => {
    setSaving(true);
    setSaveError(null);

    try {
      const formattedAnswers = results.questions.map((question, index) => {
        let userAnswer = results.answers[index];

        if (
          userAnswer &&
          typeof userAnswer === "object" &&
          userAnswer.selected_answer
        ) {
          userAnswer = userAnswer.selected_answer;
        }

        return {
          question_id: question.question_id,
          selected_answer: userAnswer,
        };
      });

      const status =
        results.answers.length < results.questions.length
          ? "ABANDONED"
          : "COMPLETED";

      const payload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: results.quizData.quiz_id,
        answers: formattedAnswers,
        status: status,
      };

      const response = await fetch(`${API_BASE_URL}/result/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save results");
      }

      const totalPoints = results.questions.reduce(
        (sum, q) => sum + (q.points || 1),
        0
      );
      const percentage = Math.round(
        (data.data.score / data.data.max_score) * 100
      );

      setTestResults({
        ...results,
        score: data.data.score,
        totalPoints: data.data.max_score,
        percentage: percentage,
        result_id: data.data.result_id,
        status: data.data.status,
      });

      setDetailedResults(data.data.detailed_results || []);
      setResultSaved(true);
      setSaving(false);
    } catch (error) {
      console.error("Error saving results to backend:", error);
      setSaveError(error.message || "Failed to save results to server");
      setSaving(false);
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem("testResults");
    localStorage.removeItem("selectedQuiz");
    localStorage.removeItem("applicantData");
    navigate("/");
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return { level: "Master", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80)
      return { level: "Excellent", color: "text-teal-600", bg: "bg-teal-100" };
    if (percentage >= 70)
      return { level: "Great", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { level: "Good", color: "text-cyan-600", bg: "bg-cyan-100" };
    return {
      level: "Keep Trying",
      color: "text-amber-600",
      bg: "bg-amber-100",
    };
  };

  const formatUserAnswer = (userAnswer) => {
    if (userAnswer === null || userAnswer === undefined) {
      return "No answer provided";
    }
    if (Array.isArray(userAnswer)) {
      return userAnswer.length > 0
        ? userAnswer.join(", ")
        : "No answer provided";
    }
    return userAnswer.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#217486] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!testResults) {
    return null;
  }

  const { score, totalPoints, percentage, quizData, questions } = testResults;
  const performance = getPerformanceLevel(percentage);
  const scoreCalculated = score !== undefined && score !== null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Header Card */}
          <div className="bg-gradient-to-r from-[#217486] to-[#2c8fa3] rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{quizData.quiz_name}</h1>
                <p className="text-white/80 text-sm">
                  Test Completed Successfully
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>

            {scoreCalculated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-black">{percentage}%</div>
                  <div className="text-white/80 text-lg">/ 100%</div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full ${performance.bg} ${performance.color} font-bold text-sm`}
                >
                  {performance.level}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/90">Calculating your score...</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {scoreCalculated && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {score}/{totalPoints}
                </div>
                <div className="text-gray-600 text-sm">Points</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <FileText className="w-8 h-8 text-[#217486] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {questions.length}
                </div>
                <div className="text-gray-600 text-sm">Questions</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {quizData.time_limit}
                </div>
                <div className="text-gray-600 text-sm">Minutes</div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {saving && (
            <div className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl mb-4">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700 text-sm">
                Saving your results...
              </span>
            </div>
          )}

          {resultSaved && (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 px-4 py-3 rounded-xl mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">
                Results saved successfully!
              </span>
            </div>
          )}

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-800 font-medium text-sm mb-1">
                    Failed to save results
                  </p>
                  <p className="text-red-600 text-xs">{saveError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          {scoreCalculated && detailedResults.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#217486]" />
                Detailed Results
              </h2>

              <div className="space-y-4">
                {questions.map((question, index) => {
                  const detailedResult =
                    detailedResults.find(
                      (dr) => dr.question_id === question.question_id
                    ) || {};

                  const isCorrect = detailedResult.is_correct;
                  const userAnswer = detailedResult.user_answer;
                  const correctAnswers = detailedResult.correct_answers || [];

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        isCorrect === null
                          ? "bg-gray-50 border-gray-200"
                          : isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${
                            isCorrect === null
                              ? "bg-gray-100 border-gray-300 text-gray-600"
                              : isCorrect
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-red-100 border-red-300 text-red-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <p className="text-gray-900 font-medium text-sm flex-1">
                              {question.question_text}
                            </p>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              {question.points} pt
                              {question.points !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-white rounded-lg p-3 border">
                              <div className="text-gray-600 text-xs font-medium mb-1">
                                YOUR ANSWER
                              </div>
                              <div
                                className={`font-medium ${
                                  isCorrect === null
                                    ? "text-gray-700"
                                    : isCorrect
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {formatUserAnswer(userAnswer)}
                              </div>
                            </div>

                            {isCorrect !== null && (
                              <div className="bg-white rounded-lg p-3 border border-green-200">
                                <div className="text-green-600 text-xs font-medium mb-1">
                                  CORRECT ANSWER
                                </div>
                                <div className="text-green-700 font-medium">
                                  {correctAnswers.join(", ")}
                                </div>
                              </div>
                            )}
                          </div>

                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-blue-700 text-xs font-medium mb-1">
                                EXPLANATION
                              </div>
                              <div className="text-blue-800 text-sm">
                                {question.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#217486] hover:bg-[#1c6574] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompletedTestResults;
