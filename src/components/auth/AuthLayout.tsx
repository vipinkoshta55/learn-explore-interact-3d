
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-secondary hidden md:flex flex-col justify-center items-center p-10 text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Welcome to SciViz</h1>
          <p className="text-lg mb-6">
            Discover the wonders of science through interactive 3D experiments,
            quizzes, and AI assistance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Interactive Learning</h3>
              <p className="text-sm">Engage with 3D experiments</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm">Monitor your learning journey</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">AI Assistance</h3>
              <p className="text-sm">Get help when you need it</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1">Quiz Yourself</h3>
              <p className="text-sm">Test your understanding</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
