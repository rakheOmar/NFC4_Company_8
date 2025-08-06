import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Scale, Shield, Copyright, AlertTriangle, Settings } from "lucide-react";

const TermsOfService = () => {
  const terms = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Use of Platform",
      description: "Lawful mining operations and compliance requirements",
      content: "You must use the platform only for lawful mining operations and in accordance with all applicable regulations. Misuse of services or attempts to bypass security will result in termination.",
      badge: "Compliance",
      number: "1"
    },
    {
      icon: <Copyright className="h-6 w-6" />,
      title: "Intellectual Property",
      description: "Protected content and usage restrictions",
      content: "All content, features, and tools provided by CoalGuard are protected by intellectual property laws. You may not reuse or reproduce any content without explicit permission.",
      badge: "Protected",
      number: "2"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Limitation of Liability",
      description: "Service availability and data accuracy disclaimers",
      content: "We strive to ensure high availability and accurate data; however, we are not liable for any damages or losses due to interruptions, inaccuracies, or misuse of data from our platform.",
      badge: "Disclaimer",
      number: "3"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Modifications",
      description: "Terms updates and user notification process",
      content: "CoalGuard reserves the right to update these terms at any time. Users will be notified of significant changes via email or dashboard notification.",
      badge: "Updates",
      number: "4"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-600 dark:text-slate-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            By using CoalGuard, you agree to be bound by the following terms and conditions. Please read them carefully.
          </p>
        </div>

        <Separator className="mb-12 bg-slate-200 dark:bg-slate-700" />

        {/* Terms Cards */}
        <div className="space-y-6 mb-12">
          {terms.map((term, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-lg font-bold px-3 py-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                        {term.number}
                      </Badge>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-600 dark:group-hover:bg-slate-600 group-hover:text-white dark:group-hover:text-slate-200 transition-colors duration-300">
                        {term.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">{term.title}</CardTitle>
                      <CardDescription className="text-sm mt-1 text-slate-600 dark:text-slate-400">{term.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {term.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                  {term.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice Section */}
        <Card className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-l-4 border-l-orange-500 dark:border-l-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <Shield className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              <span>Important Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-400">
                These terms constitute a legally binding agreement between you and CoalGuard. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Legally Binding
                </Badge>
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  Effective Immediately
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
            CoalGuard Technologies • Terms of Service Agreement
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
