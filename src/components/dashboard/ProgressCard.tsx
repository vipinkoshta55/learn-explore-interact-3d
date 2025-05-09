
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCardProps {
  subject: string;
  color: string;
  completedExperiments: number;
  totalExperiments: number;
  averageScore: number;
}

const ProgressCard = ({
  subject,
  color,
  completedExperiments,
  totalExperiments,
  averageScore,
}: ProgressCardProps) => {
  const completionPercentage = Math.round((completedExperiments / totalExperiments) * 100);

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${color}`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{subject}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {completedExperiments} of {totalExperiments} experiments completed
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Average Score</span>
            <span className="font-medium">{averageScore}%</span>
          </div>
          <Progress 
            value={averageScore} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
