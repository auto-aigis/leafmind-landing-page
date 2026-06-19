"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Leaf,
  MessageCircle,
  Camera,
  Calendar,
  Sun,
  Droplets,
  Brain,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  CloudSun,
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string | null;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const [email, setEmail] = useState("");

  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      title: "Context-Aware AI Chat",
      description:
        "Chat naturally about your plants. The AI remembers every detail — pot size, soil type, watering history, and past issues.",
    },
    {
      icon: <Camera className="h-6 w-6 text-emerald-600" />,
      title: "Photo Disease Diagnosis",
      description:
        "Upload a photo of yellowing leaves or spots. Get instant, accurate diagnosis with treatment plans specific to your setup.",
    },
    {
      icon: <CloudSun className="h-6 w-6 text-emerald-600" />,
      title: "Local Climate Integration",
      description:
        "Connects to your local weather data. Adjusts care advice based on actual humidity, temperature, and seasonal changes.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-emerald-600" />,
      title: "Personalized Weekly Plans",
      description:
        "Get a tailored care schedule every week based on your apartment conditions, not generic one-size-fits-all timers.",
    },
    {
      icon: <Sun className="h-6 w-6 text-emerald-600" />,
      title: "Light & Space Mapping",
      description:
        "Tell us your window direction and room layout. We calculate actual light exposure for placement recommendations.",
    },
    {
      icon: <Droplets className="h-6 w-6 text-emerald-600" />,
      title: "Adaptive Watering Intelligence",
      description:
        "No more guessing. Our AI learns from your plant diary and adjusts watering frequency as conditions change.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Build Your Plant Profile",
      description:
        "Add your plants with photos, pot size, soil type, and placement. Tell us about your windows and apartment layout.",
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "02",
      title: "Chat With Your AI Companion",
      description:
        "Ask anything — from watering schedules to troubleshooting brown tips. The AI knows YOUR specific context.",
      icon: <MessageCircle className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "03",
      title: "Get Your Weekly Care Plan",
      description:
        "Receive personalized tasks every week, adapted to your local weather, seasonal changes, and plant growth stage.",
      icon: <Calendar className="h-8 w-8 text-emerald-600" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Seedling",
      price: "Free",
      period: "",
      description: "Perfect for getting started with 1-3 plants",
      features: [
        "Up to 3 plant profiles",
        "Basic AI chat (10 messages/day)",
        "Weekly care reminders",
        "Community access",
      ],
      highlighted: false,
      badge: null,
    },
    {
      name: "Greenhouse",
      price: "$9",
      period: "/month",
      description: "For dedicated plant parents with growing collections",
      features: [
        "Unlimited plant profiles",
        "Unlimited AI chat",
        "Photo disease diagnosis",
        "Local climate integration",
        "Personalized weekly plans",
        "Plant history & diary",
        "Priority support",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Botanist",
      price: "$19",
      period: "/month",
      description: "For serious collectors and urban garden enthusiasts",
      features: [
        "Everything in Greenhouse",
        "Advanced light mapping",
        "Multi-room management",
        "Propagation guidance",
        "Seasonal transition plans",
        "API access for smart home",
        "1-on-1 expert consultations",
      ],
      highlighted: false,
      badge: null,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How is LeafMind different from other plant care apps?",
      answer:
        "Unlike generic plant care apps that give the same advice to everyone, LeafMind builds a complete profile of YOUR specific setup — your apartment light, humidity, pot sizes, soil types, and watering history. Our AI gives advice based on all of this context, not just the plant species.",
    },
    {
      question: "Do I need any special equipment or sensors?",
      answer:
        "No hardware needed! LeafMind works entirely through our web app. You provide information about your setup, and we integrate local weather data automatically. However, if you have smart home sensors, our Botanist plan can connect to them.",
    },
    {
      question: "How accurate is the photo disease diagnosis?",
      answer:
        "Our AI has been trained on hundreds of thousands of plant disease images and achieves over 92% accuracy for common houseplant issues. Combined with your plant profile context, it provides highly relevant treatment recommendations.",
    },
    {
      question: "Can I use LeafMind on my phone?",
      answer:
        "Yes! LeafMind is a responsive web app that works beautifully on any device. No app store download required — just visit our site from your phone browser and you are ready to go.",
    },
    {
      question: "What if I have a rare or unusual plant?",
      answer:
        "LeafMind supports thousands of plant species, including many rare and uncommon varieties. If your exact cultivar is not in our database, the AI can still provide personalized care based on the plant family and your specific growing conditions.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">LeafMind</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 transition hover:text-emerald-600">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 transition hover:text-emerald-600">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-gray-600 transition hover:text-emerald-600">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-gray-600 transition hover:text-emerald-600">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Log In
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Zap className="mr-1 h-3 w-3" />
              AI-Powered Plant Care — Now in Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your AI plant companion that actually knows{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                YOUR plants
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Stop killing plants with generic care sheets. LeafMind remembers your specific setup — pot size, soil type,
              window direction, local climate — and gives hyper-personalized advice through natural conversation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free forever for up to 3 plants. No credit card required.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 from beta users</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Privacy-first approach</span>
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-emerald-500" />
                <span>2,000+ plant species supported</span>
              </div>
            </div>
          </div>

          {/* Mock Chat UI */}
          <div className="mx-auto mt-16 max-w-2xl">
            <Card className="overflow-hidden border-gray-200 shadow-2xl shadow-emerald-100/50">
              <CardHeader className="border-b bg-gray-50 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <CardTitle className="text-sm font-medium text-gray-700">LeafMind AI Chat</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-gray-100 px-4 py-2">
                    <p className="text-sm text-gray-700">
                      My Monstera{"'"}s leaves are yellowing, it{"'"}s been 3 weeks since I watered. What{"'"}s wrong?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-emerald-50 px-4 py-2">
                    <p className="text-sm text-gray-700">
                      Based on your Monstera{"'"}s profile — it{"'"}s in a 10{'"'} terracotta pot with chunky aroid mix, facing
                      your south-east window — 3 weeks is actually too long for your current conditions. Your local humidity
                      dropped to 35% this week. I{"'"}d recommend watering thoroughly today and misting every other day until
                      humidity recovers. The yellowing is likely underwatering stress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">Features</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything your plants wish you knew
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              LeafMind combines conversational AI, computer vision, and environmental awareness to give advice that
              actually works for YOUR specific situation.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-100 transition hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">How It Works</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Three steps to happier plants
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Getting started takes less than 5 minutes. Your plants will thank you within a week.
            </p>
          </div>
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                  {step.icon}
                </div>
                <span className="mb-2 block text-sm font-bold text-emerald-600">{step.number}</span>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute top-8 -right-6 hidden h-6 w-6 text-emerald-300 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-emerald-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by plant parents everywhere
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "I killed 3 fiddle leaf figs before LeafMind. Now mine is thriving because it told me my north-facing window was the problem, not my watering.",
                author: "Sarah K.",
                role: "Beta user, 12 plants",
              },
              {
                quote:
                  "The photo diagnosis feature saved my rare Philodendron. It identified root rot early and gave me exact steps for MY soil mix.",
                author: "Marcus T.",
                role: "Beta user, 40+ plants",
              },
              {
                quote:
                  "Finally an app that understands my apartment gets zero direct light. The weekly plans actually account for my specific conditions.",
                author: "Priya M.",
                role: "Beta user, 8 plants",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">{"\""}{testimonial.quote}{"\""}</p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">Pricing</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Plans that grow with your collection
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free and upgrade when you need more. Every plan includes our core AI chat.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-emerald-500 shadow-xl shadow-emerald-100/50 ring-1 ring-emerald-500"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500">{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      tier.highlighted ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.price === "Free" ? "Get Started Free" : "Start 14-Day Trial"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">FAQ</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-12">
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-green-700 px-8 py-16 text-center sm:px-16 sm:py-24">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Stop guessing. Start growing.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                Join thousands of plant parents who switched from generic care sheets to personalized AI guidance.
                Your plants deserve better.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
              <p className="mt-4 text-sm text-emerald-200">
                No credit card required. Free forever for up to 3 plants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900">LeafMind</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Contact
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Blog
              </a>
            </div>
            <p className="text-sm text-gray-400">
              {"© 2024 LeafMind. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}