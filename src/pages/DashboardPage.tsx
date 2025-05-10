
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ProgressCard from "@/components/dashboard/ProgressCard";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({
    name: "",
    recentExperiments: [],
    progress: {
      physics: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 },
      chemistry: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 },
      math: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 },
    },
    recommendations: [],
    quizzes: [],
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchExperiments();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      setUserData(prevData => ({
        ...prevData,
        name: profileData?.display_name || profileData?.username || user?.email?.split('@')[0] || "User",
      }));
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const fetchExperiments = async () => {
    setLoading(true);
    try {
      // Get user's experiments
      const { data: experiments, error: experimentsError } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (experimentsError) throw experimentsError;

      // Process experiments for dashboard display
      if (experiments) {
        const recentExps = experiments.slice(0, 2).map((exp: any) => ({
          id: exp.id,
          title: exp.title,
          subject: determineSubject(exp),
          description: exp.description || "No description provided",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
          difficulty: determineDifficulty(exp),
          completed: exp.results !== null,
        }));

        // Calculate statistics
        const stats = calculateStatistics(experiments);

        // Get recommendations based on user activity
        const recommendations = getRecommendations(experiments);

        // Process quiz results
        const quizzes = (experiments || [])
          .filter((exp: any) => exp.results !== null)
          .map((exp: any) => ({
            id: `${exp.id}-quiz`,
            title: exp.title,
            score: calculateQuizScore(exp.results),
            totalQuestions: 5, // Assuming 5 questions per quiz
            completedAt: exp.updated_at,
          }));

        setUserData(prevData => ({
          ...prevData,
          recentExperiments: recentExps,
          progress: stats,
          recommendations,
          quizzes,
        }));
      }
    } catch (error: any) {
      console.error('Error fetching experiments:', error.message);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your experiments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for processing experiment data
  const determineSubject = (experiment: any) => {
    const subjectKeywords = {
      physics: ['force', 'motion', 'gravity', 'pendulum', 'physics', 'mechanics', 'electricity'],
      chemistry: ['chemical', 'molecule', 'reaction', 'chemistry', 'acid', 'base', 'compound'],
      math: ['geometry', 'algebra', 'calculus', 'math', 'equation', 'function', 'statistics']
    };

    const title = experiment.title?.toLowerCase() || '';
    const description = experiment.description?.toLowerCase() || '';
    const content = title + ' ' + description;

    if (subjectKeywords.physics.some(keyword => content.includes(keyword))) {
      return 'Physics';
    } else if (subjectKeywords.chemistry.some(keyword => content.includes(keyword))) {
      return 'Chemistry';
    } else if (subjectKeywords.math.some(keyword => content.includes(keyword))) {
      return 'Math';
    }

    // Default if we can't determine
    return 'Physics';
  };

  const determineDifficulty = (experiment: any) => {
    const parameters = experiment.parameters || {};
    const complexity = parameters.complexity || Math.floor(Math.random() * 3);
    
    const difficulties = ['easy', 'medium', 'hard'] as const;
    return difficulties[complexity] || 'medium';
  };

  const calculateStatistics = (experiments: any[]) => {
    const stats = {
      physics: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 },
      chemistry: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 },
      math: { completedExperiments: 0, totalExperiments: 4, averageScore: 0 }
    };

    let scores = {
      physics: { total: 0, count: 0 },
      chemistry: { total: 0, count: 0 },
      math: { total: 0, count: 0 }
    };

    experiments.forEach(exp => {
      const subject = determineSubject(exp).toLowerCase();
      if (subject in stats && exp.results) {
        stats[subject as keyof typeof stats].completedExperiments++;
        
        const score = calculateQuizScore(exp.results);
        scores[subject as keyof typeof scores].total += score;
        scores[subject as keyof typeof scores].count++;
      }
    });

    // Calculate averages
    Object.keys(scores).forEach(subject => {
      const key = subject as keyof typeof scores;
      const count = scores[key].count;
      if (count > 0) {
        stats[key as keyof typeof stats].averageScore = Math.round((scores[key].total / count) * 20); // Scale to percentage
      }
    });

    return stats;
  };

  const calculateQuizScore = (results: any) => {
    if (!results) return 0;
    
    try {
      const parsedResults = typeof results === 'string' ? JSON.parse(results) : results;
      const correct = parsedResults.correct || 0;
      return correct;
    } catch (e) {
      return 0;
    }
  };

  const getRecommendations = (experiments: any[]) => {
    // Simple recommendation logic based on what the user hasn't tried yet
    const completedSubjects = new Set(
      experiments.map(exp => determineSubject(exp).toLowerCase())
    );
    
    const recommendations = [
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
      {
        id: "molecular-structure",
        title: "Molecular Structure",
        subject: "Chemistry",
        description: "Build and manipulate 3D models of molecules to understand chemical bonding.",
        image: "https://images.unsplash.com/photo-1554475659-637f3279e46d?q=80&w=1000&auto=format&fit=crop",
        difficulty: "medium" as const,
      }
    ];
    
    // Filter to show subjects the user hasn't tried yet, or the least represented ones
    return recommendations.filter(rec => 
      !completedSubjects.has(rec.subject.toLowerCase())
    ).slice(0, 2);
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
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
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
                      {userData.recentExperiments.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {userData.recentExperiments.map((experiment: any) => (
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
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {userData.recommendations.map((experiment: any) => (
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
                    {[...userData.recentExperiments, ...userData.recommendations].length > 0 ? (
                      [...userData.recentExperiments, ...userData.recommendations].map((experiment: any) => (
                        <ExperimentCard
                          key={experiment.id}
                          {...experiment}
                        />
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
                </TabsContent>
                
                <TabsContent value="quizzes">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
                    {userData.quizzes.length > 0 ? (
                      <div className="space-y-4">
                        {userData.quizzes.map((quiz: any) => (
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
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default DashboardPage;
