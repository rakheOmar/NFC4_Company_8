import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Database, Users, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const policies = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Your Data",
      description: "Essential data collection for enhanced user experience",
      content: "We collect only essential data needed to enhance user experience, improve safety features, and monitor site analytics. We do not sell your data to any third-party services.",
      badge: "No Sale Policy"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Security",
      description: "Enterprise-grade security and encryption",
      content: "All your information is encrypted and securely stored. Our platform uses modern cybersecurity protocols to prevent unauthorized access or misuse.",
      badge: "Encrypted"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Usage",
      description: "Personalized insights and real-time monitoring",
      content: "We use your data to personalize your dashboard, generate insights, and deliver real-time alerts relevant to your coal mining operations.",
      badge: "Mining Focused"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Third-Party Services",
      description: "Vetted integrations for enhanced functionality",
      content: "We may integrate with third-party analytics and alert systems. These services are vetted for compliance and security.",
      badge: "Compliance Ready"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we protect and handle your information.
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Policy Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {policies.map((policy, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {policy.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">{policy.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{policy.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {policy.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {policy.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information Section */}
        <Card className="bg-muted/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                For any questions regarding our privacy policy or data handling practices, our support team is here to help.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className="px-4 py-2">
                  <Mail className="h-4 w-4 mr-2" />
                  support@coalguard.tech
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
