import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import QuizCard from "@/components/quiz/QuizCard";

const QuizPage = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // In a real app, this would be fetched from an API
  const quizData = {
    pendulum: {
      title: "Simple Pendulum Quiz",
      experimentTitle: "Simple Pendulum",
      experimentPath: `/experiments/pendulum`,
      questions: [
        {
          id: "p1",
          question: "What happens to the period of a pendulum if its length is doubled?",
          options: [
            "The period remains the same",
            "The period doubles",
            "The period increases by a factor of √2",
            "The period increases by a factor of 2√2",
          ],
          correctAnswer: 2,
          explanation: "The period of a pendulum is proportional to the square root of its length. If the length is doubled, the period increases by a factor of √2.",
        },
        {
          id: "p2",
          question: "Which of the following does NOT affect the period of a simple pendulum?",
          options: [
            "Length of the pendulum",
            "Mass of the bob",
            "Gravitational acceleration",
            "Amplitude (for small angles)",
          ],
          correctAnswer: 1,
          explanation: "The mass of the bob does not affect the period of a simple pendulum. The period depends on the length and gravitational acceleration.",
        },
        {
          id: "p3",
          question: "On which planet would a pendulum swing the slowest?",
          options: [
            "Earth (g = 9.8 m/s²)",
            "Mars (g = 3.7 m/s²)",
            "Venus (g = 8.9 m/s²)",
            "Jupiter (g = 24.8 m/s²)",
          ],
          correctAnswer: 1,
          explanation: "The period of a pendulum is inversely proportional to the square root of gravitational acceleration. Mars has the lowest gravity among the options, so a pendulum would swing the slowest there.",
        },
        {
          id: "p4",
          question: "What is the formula for the period of a simple pendulum?",
          options: [
            "T = 2π√(L/g)",
            "T = 2π√(g/L)",
            "T = 2π√(m/L)",
            "T = 2π√(m·L/g)",
          ],
          correctAnswer: 0,
          explanation: "The period of a simple pendulum is T = 2π√(L/g), where L is the length and g is the gravitational acceleration.",
        },
        {
          id: "p5",
          question: "As the amplitude of a pendulum increases beyond small angles, what happens to its period?",
          options: [
            "It decreases slightly",
            "It increases slightly",
            "It remains exactly the same",
            "It becomes unpredictable",
          ],
          correctAnswer: 1,
          explanation: "For larger amplitudes, the small-angle approximation breaks down, and the period increases slightly compared to the small-angle formula.",
        },
      ],
    },
    // Other quizzes would be defined here
  };
  
  // Check if the requested quiz exists
  if (!experimentId || !(experimentId in quizData)) {
    return <Navigate to="/experiments" replace />;
  }
  
  const quiz = quizData[experimentId as keyof typeof quizData];
  const { questions } = quiz;
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };
  
  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container px-4 py-8">
          {!quizCompleted ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-2xl font-bold">{quiz.title}</h1>
                  <span className="text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="max-w-3xl mx-auto">
                <QuizCard 
                  question={questions[currentQuestion]} 
                  onNext={handleNextQuestion} 
                  isLastQuestion={currentQuestion === questions.length - 1}
                />
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto text-center p-8">
              <div className="mb-8">
                <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-green-600 dark:text-green-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Great job completing the quiz. Your results have been saved to your profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link to={quiz.experimentPath}>Return to Experiment</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default QuizPage;
