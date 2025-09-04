import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const handleCheckout = async (priceId: string) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId })
  });
  const { url } = await response.json();
  window.location.href = url;
};

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals",
      features: [
        "Track up to 5 certifications",
        "Basic AI document parsing",
        "Email renewal reminders",
        "Mobile app access",
        "Community support",
      ],
      cta: "Coming Soon",
      popular: false,
    },
    {
      name: "Pro",
      price: "$15",
      description: "per month",
      features: [
        "Unlimited certifications",
        "Advanced AI insights & recommendations",
        "Career analytics & salary insights",
        "Smart renewal predictions",
        "Priority support",
        "Export & reporting tools",
        "Calendar integrations",
      ],
      cta: "Get Started",
      priceId: "price_1S3bcaBTSETMx8kbqVeCXdRG",
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      description: "per month",
      features: [
        "Everything in Pro",
        "Team compliance dashboard",
        "Bulk certificate management",
        "Advanced reporting & analytics",
        "Admin controls & permissions",
        "SSO integration",
        "Dedicated account manager",
      ],
      cta: "Coming Soon",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Simple, AI-powered pricing
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mx-auto mt-4">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-cyan-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-center text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => plan.name === 'Pro' ? handleCheckout((plan as any).priceId) : undefined}
                  disabled={plan.name !== 'Pro'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}