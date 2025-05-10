
import { Link } from "react-router-dom";

interface ExperimentItem {
  id: string;
  title: string;
  subject: string;
  image: string;
}

interface RecommendedExperimentsProps {
  recommendations: ExperimentItem[];
}

const RecommendedExperiments = ({ recommendations }: RecommendedExperimentsProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((experiment) => (
          <div key={experiment.id} className="flex items-center gap-4 bg-card rounded-lg p-4 border">
            <div className="w-16 h-16 overflow-hidden rounded-md">
              <img
                src={experiment.image}
                alt={experiment.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{experiment.title}</h3>
              <p className="text-sm text-muted-foreground">{experiment.subject}</p>
            </div>
            <div>
              <Link to={`/experiments/${experiment.id}`}>
                <button className="text-primary hover:underline text-sm">
                  Start
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedExperiments;
