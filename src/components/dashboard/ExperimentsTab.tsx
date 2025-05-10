
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ExperimentCard from "@/components/experiments/ExperimentCard";

interface ExperimentItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  image: string;
  difficulty: "easy" | "medium" | "hard";
  completed?: boolean;
}

interface ExperimentsTabProps {
  experiments: ExperimentItem[];
  recommendations: ExperimentItem[];
}

const ExperimentsTab = ({ experiments, recommendations }: ExperimentsTabProps) => {
  const allExperiments = [...experiments, ...recommendations];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allExperiments.length > 0 ? (
        allExperiments.map((experiment) => (
          <ExperimentCard key={experiment.id} {...experiment} />
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any experiments yet.</p>
          <Button asChild>
            <Link to="/experiments">Explore experiments</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExperimentsTab;
