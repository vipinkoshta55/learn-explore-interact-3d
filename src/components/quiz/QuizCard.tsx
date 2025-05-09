
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  question: QuizQuestion;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuizCard = ({ question, onNext, isLastQuestion }: QuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    onNext();
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => !isAnswered && setSelectedOption(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-md border ${
                isAnswered
                  ? index === question.correctAnswer
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : selectedOption === index
                    ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    : "bg-white dark:bg-gray-950"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                disabled={isAnswered}
                className="border-primary"
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
              </Label>
              {isAnswered && index === question.correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {isAnswered && selectedOption === index && selectedOption !== question.correctAnswer && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>

        {isAnswered && (
          <div className={`mt-4 p-3 rounded-md ${
            isCorrect 
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" 
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}>
            <p className="font-medium mb-1">
              {isCorrect ? "Correct!" : "Not quite right."}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAnswered ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
