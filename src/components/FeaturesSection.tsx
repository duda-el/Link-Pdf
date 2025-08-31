import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BookOpen, Layers, Paintbrush } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description = "" }: FeatureCardProps) => {
  return (
    <Card id="features" className="bg-white h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Reader Mode",
      description:
        "Clean, distraction-free reading experience with perfect formatting. No ads, no popups, just the content you need.",
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      title: "Batch Export",
      description:
        "Convert multiple links into a single organized PDF document. Perfect for research, study materials, or content collections.",
    },
    {
      icon: <Paintbrush className="w-6 h-6 text-blue-600" />,
      title: "Customization Options",
      description:
        "Adjust fonts, margins, and layouts to create the perfect reading experience. Save your preferences for future conversions.",
    },
  ];

  return (
    <section id="features" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our Link-to-PDF converter offers everything you need to create
            perfect, readable documents from any webpage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
