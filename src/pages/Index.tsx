
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ExperimentCard from "@/components/experiments/ExperimentCard";

const Index = () => {
  // Featured experiments data
  const featuredExperiments = [
    {
      id: "pendulum",
      title: "Simple Pendulum",
      subject: "Physics",
      description: "Explore the motion of a simple pendulum and understand the factors that affect its period.",
      image: "https://images.unsplash.com/photo-1599013242178-91a304380f63?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy" as const,
    },
    {
      id: "geometry",
      title: "3D Geometry",
      subject: "Math",
      description: "Visualize and manipulate 3D geometric shapes to understand their properties.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      difficulty: "medium" as const,
    },
    {
      id: "chemical-reactions",
      title: "Chemical Reactions",
      subject: "Chemistry",
      description: "Simulate various chemical reactions and observe how different factors affect reaction rates.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
      difficulty: "hard" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 hero-gradient">
        <div className="container px-4 py-16 md:py-24 flex flex-col lg:flex-row items-center">
          <div className="flex-1 space-y-6 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Learn Science Through <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Interactive 3D</span> Experiences
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Visualize complex concepts in mathematics, physics, and chemistry with interactive 3D experiments, quizzes, and AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="px-8">
                <Link to="/subjects/physics">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute top-4 -left-4 w-20 h-20 bg-primary/20 rounded-full animate-float" style={{animationDelay: "0s"}} />
            <div className="absolute bottom-12 -right-8 w-32 h-32 bg-secondary/20 rounded-full animate-float" style={{animationDelay: "1s"}} />
            <img 
              src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1000&auto=format&fit=crop" 
              alt="3D Science Visualization" 
              className="rounded-lg shadow-2xl relative z-10 animate-float" 
              style={{animationDelay: "0.5s"}}
            />
          </div>
        </div>
      </section>
      
      {/* Subjects Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Mathematics",
                icon: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop",
                description: "Visualize geometric shapes, graph functions, and understand complex mathematical concepts.",
                link: "/subjects/math",
                color: "from-blue-500 to-blue-700",
              },
              {
                title: "Physics",
                icon: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=400&auto=format&fit=crop",
                description: "Experiment with forces, motion, energy, and other fundamental physics principles.",
                link: "/subjects/physics",
                color: "from-purple-500 to-purple-700",
              },
              {
                title: "Chemistry",
                icon: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=400&auto=format&fit=crop",
                description: "Observe chemical reactions, molecular structures, and laboratory processes.",
                link: "/subjects/chemistry",
                color: "from-teal-500 to-teal-700",
              },
            ].map((subject, index) => (
              <Link to={subject.link} key={index} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col card-hover">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={subject.icon}
                      alt={subject.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{subject.title}</h3>
                    <p className="text-muted-foreground">{subject.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Button className={`w-full bg-gradient-to-r ${subject.color}`}>
                      Explore {subject.title}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Experiments Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Experiments</h2>
            <Button variant="outline" asChild>
              <Link to="/experiments">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} {...experiment} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why SciViz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Interactive Learning",
                description: "Engage with interactive 3D models that bring abstract concepts to life.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                ),
              },
              {
                title: "Comprehensive Quizzes",
                description: "Test your knowledge with quizzes tailored to each experiment.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Progress Tracking",
                description: "Monitor your learning journey with detailed progress analytics.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "AI Assistance",
                description: "Get help from our AI assistant whenever you need it.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are already using SciViz to enhance their understanding of science concepts.
          </p>
          <Button size="lg" variant="secondary" asChild className="px-8">
            <Link to="/auth/register">Sign Up For Free</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
