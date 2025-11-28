export const transformResult = (result) => ({
  id: result.result_id,
  examiner_name: `${result.Examiner?.first_name || ""} ${
    result.Examiner?.last_name || ""
  }`,
  email: result.Examiner?.email || "N/A",
  department: result.Examiner?.Department?.dept_name || "N/A",
  quiz_name: result.Quiz?.quiz_name || "N/A",
  score: result.score ?? 0,
  total_points: result.total_points ?? 0,
  status: result.status,
  created_at: result.created_at, // Added this for filtering
  date: new Date(result.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  time: new Date(result.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }), // Added this line - extracts time from created_at
});

export const transformExaminers = (examiner) => ({
  id: examiner.examiner_id,
  examiner_name: `${examiner.first_name} ${examiner.last_name}`,
  department: examiner.Department?.dept_name || "N/A",
  email: examiner.email,
  // Store raw timestamp for filtering
  created_at: examiner.created_at,
  // Display date only
  date: new Date(examiner.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  // Display time only
  time: new Date(examiner.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
});

export const filteredDepartments = (departments, searchTerm, filterActive) =>
  departments.filter((dept) => {
    const matchesSearch = dept.dept_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && dept.is_active) ||
      (filterActive === "inactive" && !dept.is_active);
    return matchesSearch && matchesFilter;
  });


  export const formatAnswers = (questions = [], answers = []) => {
  return questions.map((question, index) => {
    const userAnswer = answers[index];

    switch (question.question_type) {
      case "CB": // Checkbox
        return {
          question_id: question.question_id,
          selected_answer: Array.isArray(userAnswer) ? userAnswer : [],
        };

      case "DESC": // Descriptive / Essay
        return {
          question_id: question.question_id,
          selected_answer:
            typeof userAnswer === "string" ? userAnswer.trim() : "",
        };

      default:
        return {
          question_id: question.question_id,
          selected_answer: userAnswer ?? null,
        };
    }
  });
};


export const getQuestionTypeLabel = (type) => {
    const labels = {
      MC: "Multiple Choice",
      CB: "Multiple Select",
      TF: "True/False",
    };
    return labels[type] || "Question";
  };

  export const countAnswer = (formattedAnswers = []) => {
  return formattedAnswers.filter((ans) => {
    const value = ans.selected_answer;

    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    return value !== null && value !== "";
  }).length;
};


 export const generateLast30DaysData = (isMobile, results) => {
    const days = [];
    const today = new Date();
    const dataPoints = isMobile ? 15 : 30;

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const dateString = isMobile 
        ? date.toLocaleDateString("en-US", { day: "numeric" })
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

      days.push({
        date: dateString,
        COMPLETED: 0,
        ABANDONED: 0,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    // Populate with actual data
    results.forEach((result) => {
      const resultDate = new Date(result.created_at)
        .toISOString()
        .split("T")[0];
      const dayData = days.find((day) => day.fullDate === resultDate);

      if (dayData) {
        if (result.status === "COMPLETED") {
          dayData.COMPLETED += 1;
        } else if (result.status === "ABANDONED") {
          dayData.ABANDONED += 1;
        }
      }
    });

    return days;
  };

  export const generateWeeklyPerformance = (isMobile, results ) => {
    const days = isMobile ? ["M", "T", "W", "T", "F", "S", "S"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyData = days.map((day) => ({
      day,
      completed: 0,
      abandoned: 0,
      avgScore: 0,
    }));

    results.forEach((result) => {
      const resultDate = new Date(result.created_at);
      const dayIndex = (resultDate.getDay() + 6) % 7;

      if (weeklyData[dayIndex]) {
        if (result.status === "COMPLETED") {
          weeklyData[dayIndex].completed += 1;
          weeklyData[dayIndex].avgScore += result.score || 0;
        } else if (result.status === "ABANDONED") {
          weeklyData[dayIndex].abandoned += 1;
        }
      }
    });

    // Calculate average scores
    weeklyData.forEach((day) => {
      if (day.completed > 0) {
        day.avgScore = Math.round(day.avgScore / day.completed);
      }
    });

    return weeklyData;
  };