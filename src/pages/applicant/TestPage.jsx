import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClockIcon from "../../assets/Clock.svg";
import Footer from "../../components/applicant/Footer";

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    const selectedQuiz =
      location.state?.quizData ||
      JSON.parse(localStorage.getItem("selectedQuiz") || "null");

    const applicantData =
      location.state?.applicantData ||
      JSON.parse(localStorage.getItem("applicantData") || "{}");

    if (!selectedQuiz || !applicantData.department) {
      alert("No quiz selected. Redirecting...");
      navigate("/quiz-selection");
      return;
    }

    setQuizData(selectedQuiz);
    setTimeRemaining(selectedQuiz.time_limit * 60);
    fetchQuestions(selectedQuiz.quiz_id);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 || loading) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, loading]);

  const fetchQuestions = async (quizId) => {
    try {
      setLoading(true);

      const questionsResponse = await fetch(
        `${API_BASE_URL}/question/get/${quizId}`
      );

      if (!questionsResponse.ok) {
        throw new Error("Failed to fetch questions");
      }

      const questionsResult = await questionsResponse.json();
      const questionsData = questionsResult.data || [];

      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          try {
            const optionsResponse = await fetch(
              `${API_BASE_URL}/answer/test/${question.question_id}`
            );

            if (!optionsResponse.ok) {
              return { ...question, options: [] };
            }

            const optionsResult = await optionsResponse.json();
            const options = optionsResult.data || [];

            return {
              ...question,
              options: options.map((opt) => ({
                answer_id: opt.answer_id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
              })),
            };
          } catch (err) {
            console.error(
              `Error fetching options for question ${question.question_id}:`,
              err
            );
            return { ...question, options: [] };
          }
        })
      );

      setQuestions(questionsWithOptions);
      setUserAnswers(new Array(questionsWithOptions.length).fill(null));
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions. Please try again.");
      navigate("/quiz-selection");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    alert("Time is up! Submitting your answers...");
    submitTest();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerId) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.question_type === "CB") {
      setSelectedAnswers((prev) => {
        if (prev.includes(answerId)) {
          return prev.filter((id) => id !== answerId);
        } else {
          return [...prev, answerId];
        }
      });
    } else {
      setSelectedAnswer(answerId);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.question_type === "CB") {
      if (selectedAnswers.length === 0) {
        alert("Please select at least one answer");
        return;
      }
    } else if (currentQuestion.question_type !== "DESC") {
      if (selectedAnswer === null) {
        alert("Please select an answer");
        return;
      }
    }

    const newUserAnswers = [...userAnswers];
    if (currentQuestion.question_type === "CB") {
      newUserAnswers[currentQuestionIndex] = selectedAnswers;
    } else {
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
    }
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
    } else {
      submitTest(newUserAnswers);
    }
  };

  const submitTest = async (answers = userAnswers) => {
    try {
      if (!quizData) {
        alert("Quiz data not found. Cannot submit test.");
        return;
      }

      const applicantData =
        location.state?.applicantData ||
        JSON.parse(localStorage.getItem("applicantData") || "{}");

      if (!applicantData?.examiner_id) {
        alert("Applicant data missing. Cannot submit test.");
        return;
      }

      // Format answers for backend
      const formattedAnswers = questions.map((question, index) => {
        const userAnswer = answers[index];

        if (question.question_type === "CB") {
          return {
            question_id: question.question_id,
            selected_answer: Array.isArray(userAnswer)
              ? question.options
                  .filter((opt) => userAnswer.includes(opt.answer_id))
                  .map((opt) => opt.option_text)
              : [],
          };
        } else if (question.question_type === "DESC") {
          return {
            question_id: question.question_id,
            selected_answer: userAnswer?.trim() || "",
          };
        } else {
          // MC / TF
          const selectedOption = question.options.find(
            (opt) => opt.answer_id === userAnswer
          );
          return {
            question_id: question.question_id,
            selected_answer: selectedOption?.option_text || "",
          };
        }
      });

      // 1️⃣ Create result
      const resultData = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        status: "COMPLETED",
        answers: formattedAnswers,
      };

      console.log("Submitting result payload:", resultData);

      const response = await fetch(`${API_BASE_URL}/result/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to submit result: ${errText}`);
      }

      const resultJson = await response.json();
      const createdResult = resultJson.data;
      console.log("Result created:", createdResult);

      // 2️⃣ Create bridge entry after result is created
      if (createdResult?.result_id) {
        const bridgeData = {
          examiner_id: applicantData.examiner_id,
          quiz_id: quizData.quiz_id,
          result_id: createdResult.result_id,
        };

        const bridgeResponse = await fetch(`${API_BASE_URL}/bridge/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bridgeData),
        });

        if (!bridgeResponse.ok) {
          const bridgeErrText = await bridgeResponse.text();
          console.warn("Failed to create bridge:", bridgeErrText);
        } else {
          const bridgeJson = await bridgeResponse.json();
          console.log("Bridge created successfully:", bridgeJson.data);
        }
      }

      // Save test results locally
      localStorage.setItem(
        "testResults",
        JSON.stringify({ quizData, questions, answers: formattedAnswers })
      );

      navigate("/completed-test");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    }
  };

  const handleBackToHome = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be lost."
      )
    ) {
      navigate("/");
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      MC: "Multiple Choice",
      CB: "Multiple Select",
      TF: "True/False",
      DESC: "Descriptive",
    };
    return labels[type] || "Question";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6">
            This quiz doesn't have any questions yet.
          </p>
          <button
            onClick={() => navigate("/quiz-selection")}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="flex-1 px-6 sm:px-8 lg:px-16 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10 sm:mb-12">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-normal text-base">Exit Test</span>
            </button>

            <div
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200"
              style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <img src={ClockIcon} className="w-5 h-5" alt="clock" />
              <span className="font-semibold text-gray-900 text-lg">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {getQuestionTypeLabel(currentQuestion.question_type)}
              </h1>
              <span className="text-cyan-600 font-normal text-lg sm:text-xl">
                &gt; Question {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <p className="text-gray-900 text-base sm:text-lg leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>

          {currentQuestion.question_type === "DESC" ? (
            <div className="mb-16 sm:mb-20">
              <textarea
                value={selectedAnswer || ""}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 sm:mb-20">
              {currentQuestion.options.map((option) => {
                const isSelected =
                  currentQuestion.question_type === "CB"
                    ? selectedAnswers.includes(option.answer_id)
                    : selectedAnswer === option.answer_id;

                return (
                  <button
                    key={option.answer_id}
                    onClick={() => handleAnswerSelect(option.answer_id)}
                    className={`p-5 sm:p-6 rounded-lg text-left text-base sm:text-lg font-normal transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-cyan-50 text-black border-cyan-500"
                        : "bg-gray-50 text-black hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {currentQuestion.question_type === "CB" ? (
                        <div
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-cyan-600 border-cyan-600"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-cyan-600" : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                          )}
                        </div>
                      )}
                      <span>{option.option_text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-10 sm:px-16 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-base sm:text-lg"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TestPage;
