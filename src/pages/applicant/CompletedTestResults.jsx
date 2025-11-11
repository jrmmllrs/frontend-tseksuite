import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Trophy, Clock, FileText, AlertCircle } from "lucide-react";
import Footer from "../../components/applicant/Footer";

const CompletedTestResults = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    loadAndSaveResults();
  }, []);

  const loadAndSaveResults = async () => {
    try {
      // Get test results from localStorage
      const results = JSON.parse(localStorage.getItem("testResults") || "null");
      const applicantData = JSON.parse(localStorage.getItem("applicantData") || "{}");

      console.log("Test Results:", results);
      console.log("Applicant Data:", applicantData);

      if (!results) {
        alert("No test results found. Redirecting...");
        navigate("/");
        return;
      }

      // Validate required data
      if (!results.quizData || !results.quizData.quiz_id) {
        console.error("Quiz data is missing or invalid");
        setSaveError("Invalid quiz data");
        setTestResults(results);
        setLoading(false);
        return;
      }

      if (results.score === undefined || results.score === null) {
        console.error("Score is missing");
        setSaveError("Invalid score data");
        setTestResults(results);
        setLoading(false);
        return;
      }

      setTestResults(results);
      setLoading(false);

      // Save results to backend
      await saveResultsToBackend(results, applicantData);
    } catch (error) {
      console.error("Error loading results:", error);
      setSaveError(error.message);
      setLoading(false);
    }
  };

  const saveResultsToBackend = async (results, applicantData) => {
    // try {
    //   setSaving(true);
    //   setSaveError(null);

    //   const resultData = {
    //     examiner_id: applicantData.examiner_id || null,
    //     quiz_id: results.quizData.quiz_id,
    //     score: Math.round(results.score), // Round to integer since DB expects INTEGER
    //     status: "COMPLETED", // Use ENUM value from database
    //   };

    //   console.log("Sending result data:", resultData);

    //   const response = await fetch(`${API_BASE_URL}/result/create`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(resultData),
    //   });
      
    //   // Log the full error structure
    //   if (data.errors) {
    //     console.log("Error details:", data.errors);
    //     // Log each error object in detail
    //     data.errors.forEach((err, index) => {
    //       console.log(`Error ${index}:`, JSON.stringify(err, null, 2));
    //     });
    //   }
    //   if (data.details) {
    //     console.log("Details:", data.details);
    //   }

    //   if (response.ok) {
    //     setResultSaved(true);
    //     console.log("Results saved successfully!");
    //   } else {
    //     const errorMsg = data.message || "Failed to save results";
    //     let errorDetails = "";
        
    //     // Handle errors array - it might contain objects
    //     if (data.errors && Array.isArray(data.errors)) {
    //       const errorMessages = data.errors.map(err => {
    //         // If error is an object with message property
    //         if (typeof err === 'object' && err.message) {
    //           return err.message;
    //         }
    //         // If error is an object, stringify it
    //         if (typeof err === 'object') {
    //           return JSON.stringify(err);
    //         }
    //         // If error is a string
    //         return err;
    //       });
    //       errorDetails = `: ${errorMessages.join(", ")}`;
    //     } else if (data.details && Array.isArray(data.details)) {
    //       errorDetails = `: ${data.details.join(", ")}`;
    //     }
        
    //     console.error("Failed to save results:", errorMsg + errorDetails);
    //     console.error("Full error object:", JSON.stringify(data, null, 2));
    //     setSaveError(errorMsg + errorDetails);
    //   }
    // } catch (error) {
    //   console.error("Error saving results:", error);
    //   setSaveError(`Network error: ${error.message}`);
    // } finally {
    //   setSaving(false);
    // }

    try {
      
    } catch (error) {
      
    }
  };

  const handleBackToHome = () => {
    // Clear test data
    localStorage.removeItem("testResults");
    localStorage.removeItem("selectedQuiz");
    localStorage.removeItem("applicantData");
    navigate("/");
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusText = (percentage) => {
    if (percentage >= 80) return "Excellent!";
    if (percentage >= 70) return "Passed";
    if (percentage >= 60) return "Good Effort";
    return "Needs Improvement";
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 70) {
      return <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" />;
    }
    return <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!testResults) {
    return null;
  }

  const { score, totalPoints, percentage, quizData, questions, answers } = testResults;

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mb-6 text-center border-2 border-gray-200">
            <div className="flex justify-center mb-6">
              {getStatusIcon(percentage)}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Test Completed!
            </h1>
            <p className="text-gray-600 mb-6">
              You've successfully completed {quizData.quiz_name}
            </p>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-bold text-cyan-600 mb-2">
                  {percentage}%
                </div>
                <p className="text-gray-600 text-sm">Overall Score</p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`inline-block px-6 py-3 rounded-full text-lg font-semibold border-2 ${getStatusColor(
                percentage
              )}`}
            >
              {getStatusText(percentage)}
            </div>

            {/* Saving Indicator */}
            {saving && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
                <span>Saving your results...</span>
              </div>
            )}

            {/* Success Message */}
            {resultSaved && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Results saved successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {saveError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Failed to save results
                    </p>
                    <p className="text-xs text-red-700">{saveError}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Don't worry, your test completion is still valid. Please contact support if this persists.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Score</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {score} / {totalPoints}
              </p>
              <p className="text-sm text-gray-600">Points earned</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Questions</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {questions.length}
              </p>
              <p className="text-sm text-gray-600">Total questions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Time Limit</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {quizData.time_limit}
              </p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Detailed Results
            </h2>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                let isCorrect = false;

                // Determine if answer is correct
                if (question.question_type === "CB") {
                  const correctAnswerIds = question.options
                    .filter((opt) => opt.is_correct)
                    .map((opt) => opt.answer_id);
                  isCorrect =
                    correctAnswerIds.length === userAnswer?.length &&
                    correctAnswerIds.every((id) => userAnswer.includes(id));
                } else if (question.question_type === "DESC") {
                  isCorrect = null; // Descriptive questions need manual grading
                } else {
                  const selectedOption = question.options.find(
                    (opt) => opt.answer_id === userAnswer
                  );
                  isCorrect = selectedOption?.is_correct || false;
                }

                return (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border-2 ${
                      isCorrect === null
                        ? "border-gray-200 bg-gray-50"
                        : isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect === null ? (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            ?
                          </div>
                        ) : isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            Question {index + 1}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
                            {question.points} {question.points === 1 ? "point" : "points"}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-3 font-medium">
                          {question.question_text}
                        </p>

                        {question.question_type !== "DESC" && (
                          <div className="space-y-2 text-sm">
                            {question.options.map((option) => {
                              const isUserAnswer = question.question_type === "CB"
                                ? userAnswer?.includes(option.answer_id)
                                : userAnswer === option.answer_id;

                              return (
                                <div
                                  key={option.answer_id}
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    option.is_correct
                                      ? "bg-green-100 text-green-900 font-medium"
                                      : isUserAnswer
                                      ? "bg-red-100 text-red-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option.is_correct && (
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  )}
                                  {!option.is_correct && isUserAnswer && (
                                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                  )}
                                  <span>{option.option_text}</span>
                                  {option.is_correct && (
                                    <span className="ml-auto text-xs">(Correct)</span>
                                  )}
                                  {!option.is_correct && isUserAnswer && (
                                    <span className="ml-auto text-xs">(Your answer)</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {question.question_type === "DESC" && (
                          <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                            <p className="text-gray-900">{userAnswer || "(No answer provided)"}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              This answer requires manual grading
                            </p>
                          </div>
                        )}

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-blue-900 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-800">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackToHome}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
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