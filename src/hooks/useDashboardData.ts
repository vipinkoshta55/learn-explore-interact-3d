
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  name: string;
  recentExperiments: any[];
  progress: {
    physics: { completedExperiments: number; totalExperiments: number; averageScore: number };
    chemistry: { completedExperiments: number; totalExperiments: number; averageScore: number };
    math: { completedExperiments: number; totalExperiments: number; averageScore: number };
  };
  recommendations: any[];
  quizzes: any[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
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

  return { userData, loading };
};
