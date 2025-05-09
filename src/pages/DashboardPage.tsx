
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ProgressCard from "@/components/dashboard/ProgressCard";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  // Demo user data - in a real app, this would come from an API/database
  const userData = {
    name: "Alex Johnson",
    recentExperiments: [
      {
        id: "pendulum",
        title: "Simple Pendulum",
        subject: "Physics",
        description: "Explore the motion of a simple pendulum and understand the factors that affect its period.",
        image: "https://images.unsplash.com/photo-1599013242178-91a304380f63?q=80&w=1000&auto=format&fit=crop",
        difficulty: "easy" as const,
        completed: true,
      },
      {
        id: "molecular-structure",
        title: "Molecular Structure",
        subject: "Chemistry",
        description: "Build and manipulate 3D models of molecules to understand chemical bonding.",
        image: "https://images.unsplash.com/photo-1554475659-637f3279e46d?q=80&w=1000&auto=format&fit=crop",
        difficulty: "medium" as const,
        completed: false,
      },
    ],
    progress: {
      physics: {
        completedExperiments: 2,
        totalExperiments: 4,
        averageScore: 85,
      },
      chemistry: {
        completedExperiments: 1,
        totalExperiments: 4,
        averageScore: 70,
      },
      math: {
        completedExperiments: 0,
        totalExperiments: 4,
        averageScore: 0,
      },
    },
    recommendations: [
      {
        id: "geometry",
        title: "3D Geometry",
        subject: "Math",
        description: "Visualize and manipulate 3D geometric shapes to understand their properties.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
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
    ],
    quizzes: [
      {
        id: "pendulum-quiz",
        title: "Simple Pendulum",
        score: 4,
        totalQuestions: 5,
        completedAt: "2023-07-15",
      },
      {
        id: "molecular-quiz",
        title: "Molecular Structure",
        score: 3,
        totalQuestions: 5,
        completedAt: "2023-07-10",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userData.name}</h1>
              <p className="text-muted-foreground">Track your learning progress and explore new experiments.</p>
            </div>
            <Link to="/experiments">
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Explore New Experiments
              </button>
            </Link>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experiments">Experiments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ProgressCard
                  subject="Physics"
                  color="bg-blue-500"
                  completedExperiments={userData.progress.physics.completedExperiments}
                  totalExperiments={userData.progress.physics.totalExperiments}
                  averageScore={userData.progress.physics.averageScore}
                />
                <ProgressCard
                  subject="Chemistry"
                  color="bg-teal-500"
                  completedExperiments={userData.progress.chemistry.completedExperiments}
                  totalExperiments={userData.progress.chemistry.totalExperiments}
                  averageScore={userData.progress.chemistry.averageScore}
                />
                <ProgressCard
                  subject="Mathematics"
                  color="bg-purple-500"
                  completedExperiments={userData.progress.math.completedExperiments}
                  totalExperiments={userData.progress.math.totalExperiments}
                  averageScore={userData.progress.math.averageScore}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recently Accessed</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {userData.recentExperiments.map((experiment) => (
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
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {userData.recommendations.map((experiment) => (
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
              </div>
            </TabsContent>
            
            <TabsContent value="experiments">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...userData.recentExperiments, ...userData.recommendations].map((experiment) => (
                  <ExperimentCard
                    key={experiment.id}
                    {...experiment}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="quizzes">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
                <div className="space-y-4">
                  {userData.quizzes.map((quiz) => (
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default DashboardPage;
