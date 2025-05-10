
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ProgressCard from "@/components/dashboard/ProgressCard";
import RecentExperiments from "@/components/dashboard/RecentExperiments";
import RecommendedExperiments from "@/components/dashboard/RecommendedExperiments";
import ExperimentsTab from "@/components/dashboard/ExperimentsTab";
import QuizHistory from "@/components/dashboard/QuizHistory";
import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardPage = () => {
  const { userData, loading } = useDashboardData();

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
                    <RecentExperiments
                      experiments={userData.recentExperiments}
                      loading={loading}
                    />
                    
                    <RecommendedExperiments
                      recommendations={userData.recommendations}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="experiments">
                  <ExperimentsTab
                    experiments={userData.recentExperiments}
                    recommendations={userData.recommendations}
                  />
                </TabsContent>
                
                <TabsContent value="quizzes">
                  <QuizHistory quizzes={userData.quizzes} />
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
