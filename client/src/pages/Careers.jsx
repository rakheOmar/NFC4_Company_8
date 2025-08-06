import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Users, Code, BarChart3, HardHat, Building, Mail, ArrowRight } from "lucide-react";

const Careers = () => {
  const sections = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Why Work With Us?",
      description: "Purpose-driven innovation in mining technology",
      content: "You'll work alongside passionate engineers, researchers, and designers who are committed to making coal mining safer and greener. We value innovation, ethics, and impact.",
      badge: "Culture",
      number: "1"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Open Positions",
      description: "Join our diverse team of experts",
      content: "",
      badge: "Hiring",
      number: "2",
      positions: [
        { title: "Frontend Developer", tech: "React, Tailwind", icon: <Code className="h-4 w-4" /> },
        { title: "Data Analyst", tech: "AI/ML, Carbon Metrics", icon: <BarChart3 className="h-4 w-4" /> },
        { title: "Field Safety Engineer", tech: "Mining Tech", icon: <HardHat className="h-4 w-4" /> },
        { title: "Government Liaison", tech: "Sustainability Policy", icon: <Building className="h-4 w-4" /> }
      ]
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "How to Apply",
      description: "Simple application process",
      content: "Send your resume and a short cover letter to careers@coalguard.tech. We review applications on a rolling basis.",
      badge: "Apply Now",
      number: "3"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-slate-600 dark:text-slate-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
              Careers at CoalGuard
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            At CoalGuard, we're building the future of safe, sustainable mining. Join us in transforming an industry using technology, data, and purpose-driven design.
          </p>
        </div>

        <Separator className="mb-12 bg-slate-200 dark:bg-slate-700" />

        {/* Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-lg font-bold px-3 py-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                        {section.number}
                      </Badge>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-600 dark:group-hover:bg-slate-600 group-hover:text-white dark:group-hover:text-slate-200 transition-colors duration-300">
                        {section.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.title}</CardTitle>
                      <CardDescription className="text-sm mt-1 text-slate-600 dark:text-slate-400">{section.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {section.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {section.positions ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {section.positions.map((position, posIndex) => (
                        <div key={posIndex} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400">
                              {position.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">{position.title}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{position.tech}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : section.title === "How to Apply" ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                      {section.content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <Button 
                        asChild 
                        className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white"
                      >
                        <a href="mailto:careers@coalguard.tech" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>careers@coalguard.tech</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {section.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <Card className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-l-4 border-l-orange-500 dark:border-l-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <Briefcase className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              <span>Ready to Make an Impact?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Join our mission to revolutionize mining technology and create a sustainable future. We're looking for passionate individuals who want to make a difference.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950">
                  <Heart className="h-3 w-3 mr-1" />
                  Purpose Driven
                </Badge>
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  Remote Friendly
                </Badge>
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  Growth Opportunities
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Equal Opportunity Employer • Diversity & Inclusion Committed
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
            CoalGuard Technologies • Building the Future of Mining
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
