
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ExperimentInfoProps {
  title: string;
  description: string;
  theory: string;
  application: string;
  mathContent?: {
    title: string;
    formula: string;
    explanation: string;
  }[];
}

const ExperimentInfo = ({
  title,
  description,
  theory,
  application,
  mathContent = [],
}: ExperimentInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theory">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="application">Real-world Application</TabsTrigger>
            <TabsTrigger value="math">Mathematical Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="theory" className="mt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p>{theory}</p>
            </div>
          </TabsContent>
          <TabsContent value="application" className="mt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p>{application}</p>
            </div>
          </TabsContent>
          <TabsContent value="math" className="mt-4 space-y-6">
            {mathContent.length > 0 ? (
              mathContent.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <SyntaxHighlighter language="latex" style={docco} customStyle={{background: "transparent"}}>
                      {item.formula}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-muted-foreground">{item.explanation}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Mathematical analysis not available for this experiment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExperimentInfo;
