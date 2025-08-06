import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, MessageCircle, Wrench, Phone, Mail, Clock, MapPin, HelpCircle } from "lucide-react";

const Support = () => {
  const supportSections = [
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "General Support",
      description: "Common issues and self-service options",
      content: "For common issues regarding login, account settings, or dashboard usage, visit our FAQs or use the live chat on the bottom-right of the screen.",
      badge: "Self-Service",
      number: "1",
      type: "general"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Technical Help",
      description: "Platform errors and integration assistance",
      content: "If you're facing platform errors, data issues, or integration problems, please reach out to our technical support team. Attach screenshots or error logs if possible for faster resolution.",
      badge: "Technical",
      number: "2",
      type: "technical"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Contact Methods",
      description: "Multiple ways to reach our support team",
      content: "",
      badge: "Contact",
      number: "3",
      type: "contact",
      contacts: [
        { icon: <Mail className="h-4 w-4" />, label: "Email", value: "support@coalguard.tech", link: "mailto:support@coalguard.tech" },
        { icon: <Phone className="h-4 w-4" />, label: "Phone", value: "+91-XXXXXXXXXX", link: "tel:+91XXXXXXXXXX" },
        { icon: <Clock className="h-4 w-4" />, label: "Hours", value: "Mon–Fri, 9AM–6PM IST", link: null }
      ]
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "On-site Help",
      description: "Enterprise training and support services",
      content: "For enterprise clients, we offer on-site training and support in coordination with your safety and IT departments. Please contact us to schedule a visit.",
      badge: "Enterprise",
      number: "4",
      type: "onsite"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HeadphonesIcon className="h-8 w-8 text-slate-600 dark:text-slate-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
              Support
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Need help? Our team is here to support you with everything from technical assistance to understanding carbon tracking and compliance.
          </p>
        </div>

        <Separator className="mb-12 bg-slate-200 dark:bg-slate-700" />

        {/* Support Sections */}
        <div className="space-y-8 mb-12">
          {supportSections.map((section, index) => (
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
                {section.type === "contact" ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-1">
                      {section.contacts.map((contact, contactIndex) => (
                        <div key={contactIndex} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400">
                              {contact.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">{contact.label}</h4>
                              {contact.link ? (
                                <a 
                                  href={contact.link} 
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {contact.value}
                                </a>
                              ) : (
                                <p className="text-sm text-slate-600 dark:text-slate-400">{contact.value}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : section.type === "general" ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                      {section.content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Live Chat
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Visit FAQs
                      </Button>
                    </div>
                  </div>
                ) : section.type === "onsite" ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                      {section.content}
                    </p>
                    <Button 
                      className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Schedule Enterprise Visit
                    </Button>
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

        {/* Quick Help Section */}
        <Card className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-l-4 border-l-orange-500 dark:border-l-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <HeadphonesIcon className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              <span>Need Immediate Help?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Our support team is standing by to help you resolve any issues quickly and efficiently. Choose the method that works best for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  asChild 
                  className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white"
                >
                  <a href="mailto:support@coalguard.tech" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Support</span>
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline" className="border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950">
                  <Clock className="h-3 w-3 mr-1" />
                  24/7 Emergency
                </Badge>
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  Fast Response
                </Badge>
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  Expert Team
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Available Mon–Fri, 9AM–6PM IST • Emergency support available 24/7
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
            CoalGuard Technologies • Dedicated to Your Success
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
