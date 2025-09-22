'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowRight, Target, TrendingUp, Award } from 'lucide-react';

export default function CareerHome() {
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!jobTitle.trim()) return;
    
    setIsLoading(true);
    try {
      // Get skills for the job title
      const response = await fetch('/api/career/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: jobTitle.trim() })
      });
      
      if (response.ok) {
        const { skills } = await response.json();
        const params = new URLSearchParams({
          job: jobTitle,
          skills: skills.join(',')
        });
        router.push(`/career/skills?${params}`);
      } else {
        // Fallback to manual skill entry
        router.push(`/career/skills?job=${encodeURIComponent(jobTitle)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      router.push(`/career/skills?job=${encodeURIComponent(jobTitle)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Pathways Navigator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell us what you&apos;ve done. We translate your skills into jobs you can land now 
            and next steps to reach your target role.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Start Your Career Journey
            </CardTitle>
            <CardDescription>
              Enter your current or target job title to discover your career pathways
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="e.g., Event Planner, Marketing Assistant, Data Analyst"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={!jobTitle.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Skills'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="font-semibold">Jobs You Can Land Now</h3>
              </div>
              <p className="text-sm text-gray-600">
                Find roles with 85%+ skill match based on your current experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="font-semibold">Next Career Steps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Discover roles within reach and the exact skills you need to develop
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="font-semibold">Credential Recommendations</h3>
              </div>
              <p className="text-sm text-gray-600">
                Get personalized certification and course suggestions to bridge skill gaps
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Example */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Example: Sarah the Event Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Input:</strong> Event Planner → Skills like Project Management, Budgeting, Vendor Management, Excel
              </div>
              <div>
                <strong>Now Jobs:</strong> Project Coordinator (90% match), Executive Assistant (88% match)
              </div>
              <div>
                <strong>Next Jobs:</strong> Junior Product Manager (65% match)
              </div>
              <div>
                <strong>Gap Analysis:</strong> Missing Agile, Jira, UX → Recommendations: CSM + Jira Intro + UX Research Fundamentals
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}