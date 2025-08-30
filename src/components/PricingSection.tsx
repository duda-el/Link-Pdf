import React from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
}

const PricingSection = ({
  title = "Simple, transparent pricing",
  subtitle = "Choose the plan that works best for your needs",
  tiers = [
    {
      name: "Free",
      description: "Perfect for trying out the service",
      price: "$0",
      features: [
        { name: "5 PDF conversions per day", included: true },
        { name: "Reader mode", included: true },
        { name: "Small watermark on PDFs", included: true },
        { name: "Basic customization", included: false },
        { name: "Batch export", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Get Started",
    },
    {
      name: "Credit Bundle",
      description: "For professionals and power users",
      price: "$9.99",
      features: [
        { name: "100 PDF conversions", included: true },
        { name: "Reader mode", included: true },
        { name: "No watermarks", included: true },
        { name: "Advanced customization", included: true },
        { name: "Batch export", included: true },
        { name: "Priority support", included: true },
      ],
      buttonText: "Buy Credits",
      popular: true,
    },
  ],
}) => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full ${tier.popular ? "border-primary shadow-lg" : "border-gray-200"}`}
            >
              <CardHeader>
                {tier.popular && (
                  <div className="px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full w-fit mb-2">
                    Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl font-bold">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.name === "Credit Bundle" && (
                    <span className="text-gray-500 ml-2">/ 100 credits</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300 mr-2 flex-shrink-0" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${tier.popular ? "bg-primary hover:bg-primary/90" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Need more conversions? Contact us for custom enterprise plans.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
