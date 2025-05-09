import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import Pendulum from "@/components/experiments/Pendulum";
import ExperimentInfo from "@/components/experiments/ExperimentInfo";

const ExperimentPage = () => {
  const { experimentId } = useParams<{ experimentId: string }>();

  // This would come from an API in a real app
  const experimentData = {
    pendulum: {
      title: "Simple Pendulum",
      subject: "Physics",
      description: "Explore the motion of a simple pendulum and understand the factors that affect its period.",
      component: <Pendulum />,
      theory: `A simple pendulum consists of a mass m hanging from a string of length L and fixed at a pivot point. When displaced to an initial angle and released, the pendulum will swing back and forth with periodic motion.

The period of this pendulum depends on its length and the local strength of gravity. For small amplitudes, the period T is approximately:

T ≈ 2π√(L/g)

Where:
- L is the length of the pendulum
- g is the local acceleration due to gravity

Interestingly, the period doesn't depend on the mass of the pendulum bob. This approximation is accurate for small angles (less than about 15 degrees). For larger angles, the period increases slightly.`,
      application: `Simple pendulums have many practical applications in our daily lives:

1. **Timekeeping**: Pendulum clocks were the most accurate timepieces for nearly 300 years until the development of quartz clocks.

2. **Seismometers**: Pendulums are used in seismometers to detect and measure earthquakes.

3. **Metronomes**: Musicians use pendulum-based metronomes to maintain a steady tempo.

4. **Foucault Pendulum**: A pendulum can demonstrate the Earth's rotation. As the Earth rotates beneath it, the pendulum's swing appears to rotate.

5. **Construction**: Pendulum bobs can be used as plumb bobs to establish vertical lines in construction.

Understanding pendulum physics is also important in engineering, especially for structures that might sway (like bridges and tall buildings).`,
      mathContent: [
        {
          title: "Period of a Simple Pendulum",
          formula: "T = 2π√(L/g)",
          explanation: "For small amplitudes, the period T of a simple pendulum depends only on the length L and gravitational acceleration g.",
        },
        {
          title: "Angular Frequency",
          formula: "ω = √(g/L)",
          explanation: "The angular frequency ω of a simple pendulum is the square root of gravitational acceleration divided by length.",
        },
        {
          title: "Position as a Function of Time",
          formula: "θ(t) = θₘₐₓ · cos(ωt + φ)",
          explanation: "The angle θ at time t can be expressed as a function of maximum angle, angular frequency, and phase constant φ.",
        },
      ],
    },
    // Other experiments would be defined here in a real app
  };

  const experiment = experimentId && experimentId in experimentData 
    ? experimentData[experimentId as keyof typeof experimentData] 
    : null;

  if (!experiment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Experiment Not Found</h2>
            <p className="text-muted-foreground mb-8">The experiment you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/experiments">Browse All Experiments</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/subjects/${experiment.subject.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
                  {experiment.subject}
                </Link>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-medium text-muted-foreground">Experiment</span>
              </div>
              <h1 className="text-3xl font-bold">{experiment.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/experiments/${experimentId}/quiz`}>Take Quiz</Link>
              </Button>
              <Button>Mark as Complete</Button>
            </div>
          </div>
          
          <Tabs defaultValue="experiment" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experiment">Experiment</TabsTrigger>
              <TabsTrigger value="information">Information</TabsTrigger>
            </TabsList>
            <TabsContent value="experiment" className="pt-6">
              <Card className="p-6">
                {experiment.component}
              </Card>
            </TabsContent>
            <TabsContent value="information" className="pt-6">
              <ExperimentInfo 
                title={experiment.title}
                description={experiment.description}
                theory={experiment.theory}
                application={experiment.application}
                mathContent={experiment.mathContent}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-12">
            <h2 className="text-2xl font-bold">Related Experiments</h2>
            <Button variant="outline" asChild>
              <Link to="/experiments">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* This would be populated with actual related experiments in a real app */}
            <Card className="p-6 text-center flex flex-col items-center justify-center h-64">
              <h3 className="text-xl font-medium mb-4">More experiments coming soon!</h3>
              <p className="text-muted-foreground">We're constantly adding new experiments to enhance your learning experience.</p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default ExperimentPage;
