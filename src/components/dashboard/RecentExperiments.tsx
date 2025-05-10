
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExperimentItem {
  id: string;
  title: string;
  subject: string;
  image: string;
  completed?: boolean;
}

interface RecentExperimentsProps {
  experiments: ExperimentItem[];
  loading: boolean;
}

const RecentExperiments = ({ experiments, loading }: RecentExperimentsProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recently Accessed</h2>
      {experiments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {experiments.map((experiment) => (
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
                    {experiment.completed ? "Review" : "Continue"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">You haven't started any experiments yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/experiments">Start exploring</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecentExperiments;
