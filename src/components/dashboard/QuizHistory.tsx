
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizItem {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface QuizHistoryProps {
  quizzes: QuizItem[];
}

const QuizHistory = ({ quizzes }: QuizHistoryProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
      {quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Score: {quiz.score}/{quiz.totalQuestions} ({Math.round((quiz.score / quiz.totalQuestions) * 100)}%)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(quiz.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to={`/experiments/${quiz.id.replace("-quiz", "")}/quiz`}>
                    <button className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors">
                      Retake Quiz
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">You haven't taken any quizzes yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/experiments">Try an experiment</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizHistory;
