
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  // Sample data
  const subjectData = {
    math: {
      title: "Mathematics",
      description: "Explore interactive 3D mathematical concepts and visualizations.",
      experiments: [
        {
          id: "geometry",
          title: "3D Geometry",
          subject: "Math",
          description: "Visualize and manipulate 3D geometric shapes to understand their properties.",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
        {
          id: "graph-functions",
          title: "3D Function Visualization",
          subject: "Math",
          description: "Explore 3D graphs of various functions and understand their behavior.",
          image: "https://images.unsplash.com/photo-1492962827063-e5ea0d8c01f5?q=80&w=1000&auto=format&fit=crop",
          difficulty: "hard" as const,
        },
        {
          id: "probability",
          title: "Probability Simulator",
          subject: "Math",
          description: "Visualize probability distributions and perform statistical simulations.",
          image: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?q=80&w=1000&auto=format&fit=crop",
          difficulty: "easy" as const,
        },
        {
          id: "fractals",
          title: "Fractal Explorer",
          subject: "Math",
          description: "Explore the beautiful world of fractals and understand their mathematical properties.",
          image: "https://images.unsplash.com/photo-1518544801976-5e69fbf01a83?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
      ],
    },
    physics: {
      title: "Physics",
      description: "Discover fundamental physical principles through interactive 3D simulations.",
      experiments: [
        {
          id: "pendulum",
          title: "Simple Pendulum",
          subject: "Physics",
          description: "Explore the motion of a simple pendulum and understand the factors that affect its period.",
          image: "https://images.unsplash.com/photo-1599013242178-91a304380f63?q=80&w=1000&auto=format&fit=crop",
          difficulty: "easy" as const,
        },
        {
          id: "projectile",
          title: "Projectile Motion",
          subject: "Physics",
          description: "Understand the path of objects under gravitational force with adjustable parameters.",
          image: "https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
        {
          id: "circuits",
          title: "Electric Circuits",
          subject: "Physics",
          description: "Build and analyze electric circuits with batteries, resistors, and capacitors.",
          image: "https://images.unsplash.com/photo-1620283085439-39640a88a2ed?q=80&w=1000&auto=format&fit=crop",
          difficulty: "hard" as const,
        },
        {
          id: "optics",
          title: "Geometric Optics",
          subject: "Physics",
          description: "Explore how light behaves when it passes through different media and lenses.",
          image: "https://images.unsplash.com/photo-1627552245715-77d79c0c4098?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
      ],
    },
    chemistry: {
      title: "Chemistry",
      description: "Visualize chemical reactions and molecular structures in interactive 3D environments.",
      experiments: [
        {
          id: "chemical-reactions",
          title: "Chemical Reactions",
          subject: "Chemistry",
          description: "Simulate various chemical reactions and observe how different factors affect reaction rates.",
          image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
          difficulty: "hard" as const,
        },
        {
          id: "molecular-structure",
          title: "Molecular Structure",
          subject: "Chemistry",
          description: "Build and manipulate 3D models of molecules to understand chemical bonding.",
          image: "https://images.unsplash.com/photo-1554475659-637f3279e46d?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
        {
          id: "acid-base",
          title: "Acid-Base Reactions",
          subject: "Chemistry",
          description: "Explore acids, bases, and pH through interactive titration experiments.",
          image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1000&auto=format&fit=crop",
          difficulty: "easy" as const,
        },
        {
          id: "gas-laws",
          title: "Gas Laws Explorer",
          subject: "Chemistry",
          description: "Visualize how temperature, pressure, and volume relate in gaseous systems.",
          image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1000&auto=format&fit=crop",
          difficulty: "medium" as const,
        },
      ],
    },
  };
  
  const subject = subjectId && subjectId in subjectData 
    ? subjectData[subjectId as keyof typeof subjectData] 
    : {
        title: "Subject Not Found",
        description: "The requested subject does not exist.",
        experiments: [],
      };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Subject Header */}
        <section className={`py-12 hero-gradient`}>
          <div className="container px-4">
            <h1 className="text-4xl font-bold mb-4">{subject.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{subject.description}</p>
          </div>
        </section>
        
        {/* Filter Section */}
        <section className="py-8 border-b">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-96">
                <Input placeholder="Search experiments..." />
              </div>
              <div className="w-full md:w-64">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-64">
                <Select defaultValue="newest">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Experiments Grid */}
        <section className="py-12">
          <div className="container px-4">
            <h2 className="text-2xl font-semibold mb-6">All {subject.title} Experiments</h2>
            {subject.experiments.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No experiments found</h3>
                <p className="mt-2">Please check back later or try a different subject.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.experiments.map((experiment) => (
                  <ExperimentCard key={experiment.id} {...experiment} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to master {subject.title}?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Create an account to track your progress and access all experiments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/auth/register">Sign Up</a>
              </Button>
              <Button size="lg" variant="outline">
                <a href="/dashboard">View Dashboard</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default SubjectPage;
