import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, Link, FileDown, Wand2 } from "lucide-react";

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessStep = (
  { number, title, description, icon }: ProcessStepProps = {
    number: 1,
    title: "Step Title",
    description: "Step description goes here",
    icon: <Wand2 className="h-8 w-8" />,
  },
) => {
  return (
    <Card className="bg-white flex flex-col items-center p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-primary/10 rounded-full p-4 mb-4">{icon}</div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm mb-3">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center text-sm">{description}</p>
    </Card>
  );
};

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "Paste URL",
      description: "Enter any webpage URL you want to convert to PDF",
      icon: <Link className="h-8 w-8 text-primary" />,
    },
    {
      number: 2,
      title: "Convert",
      description: "Our tool transforms the page into a clean, readable format",
      icon: <Wand2 className="h-8 w-8 text-primary" />,
    },
    {
      number: 3,
      title: "Download",
      description: "Get your distraction-free PDF ready for offline reading",
      icon: <FileDown className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <ProcessStep
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />

              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
