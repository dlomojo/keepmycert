import { Bot, Brain, TrendingUp, Shield, Users, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Document Parsing",
      description: "Upload certificate PDFs and let AI extract all details automatically. No manual data entry required."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Renewals",
      description: "AI-powered renewal predictions with personalized timing based on your certification complexity."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Career Analytics",
      description: "Get AI insights on salary impact, market demand, and career progression for each certification path."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance Tracking",
      description: "Automated compliance monitoring with audit-ready reports and documentation management."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Manage team certifications, track compliance, and get insights on skill gaps across your organization."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Intelligent reminder system that adapts to your schedule and certification renewal requirements."
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[58rem] text-center mb-16">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Everything you need to manage your IT career
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mx-auto mt-4">
          AI-powered features designed specifically for IT professionals who take their careers seriously.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600">
              {feature.icon}
            </div>
            <div className="space-y-2 mt-4">
              <h3 className="font-bold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
