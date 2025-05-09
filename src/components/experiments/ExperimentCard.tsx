
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExperimentCardProps {
  id: string;
  title: string;
  subject: string;
  description: string;
  image: string;
  difficulty: "easy" | "medium" | "hard";
  completed?: boolean;
}

const ExperimentCard = ({
  id,
  title,
  subject,
  description,
  image,
  difficulty,
  completed = false,
}: ExperimentCardProps) => {
  const difficultyColor = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card className="experiment-card h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {completed && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-primary text-white">
              Completed
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
          <Badge variant="outline" className="bg-white/20 text-white backdrop-blur-sm border-none">
            {subject}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline" className={difficultyColor[difficulty]}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/experiments/${id}`}>Explore Experiment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperimentCard;
