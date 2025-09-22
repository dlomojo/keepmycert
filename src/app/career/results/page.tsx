'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { JobMatch } from '@/lib/career-db';

function ResultsContent() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const skillsParam = searchParams?.get('skills');
    const matchesParam = searchParams?.get('matches');
    
    if (skillsParam) {
      setSkills(skillsParam.split(',').filter(Boolean));
    }
    
    if (matchesParam) {
      try {
        const parsedMatches = JSON.parse(matchesParam);
        setMatches(parsedMatches);
      } catch (error) {
        console.error('Failed to parse matches:', error);
      }
    }
  }, [searchParams]);

  const nowJobs = matches.filter(m => m.category === 'now');
  const nextJobs = matches.filter(m => m.category === 'next');

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const JobCard = ({ match }: { match: JobMatch }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" 
          onClick={() => router.push(`/career/job/${match.job.id}?skills=${skills.join(',')}`)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{match.job.title}</CardTitle>
            <CardDescription className="mt-1">
              {match.job.seniority} • {formatSalary(match.job.medianSalaryUsd)}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(match.score * 100)}%
            </div>
            <div className="text-xs text-gray-500">Match</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={match.score * 100} className="h-2" />
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Growth: {match.job.growthOutlook}</span>
          </div>

          {match.matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  Matched Skills ({match.matchedSkills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {match.matchedSkills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {match.matchedSkills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.matchedSkills.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {match.missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">
                  Missing Skills ({match.missingSkills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {match.missingSkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs border-orange-300">
                    {skill}
                  </Badge>
                ))}
                {match.missingSkills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.missingSkills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">{match.job.description}</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Matches Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find any job matches for your current skills. 
              Try adding more skills or check back later.
            </p>
            <Button onClick={() => router.back()}>
              Back to Skills
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Career Matches</h1>
          <p className="text-gray-600">
            Based on your {skills.length} skills, here are your best job opportunities
          </p>
        </div>

        <Tabs defaultValue="now" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="now" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Now Jobs ({nowJobs.length})
            </TabsTrigger>
            <TabsTrigger value="next" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Next Jobs ({nextJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="now" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                Jobs You Can Land Now (85%+ Match)
              </h2>
              <p className="text-gray-600">
                These roles closely match your current skills. You&apos;re ready to apply!
              </p>
            </div>
            
            {nowJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {nowJobs.map((match) => (
                  <JobCard key={match.job.id} match={match} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-gray-600">
                    No immediate matches found. Check the Next Jobs tab for opportunities 
                    you can work towards.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="next" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                Next Career Steps (60-84% Match)
              </h2>
              <p className="text-gray-600">
                These roles are within reach. Focus on developing the missing skills to qualify.
              </p>
            </div>
            
            {nextJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {nextJobs.map((match) => (
                  <JobCard key={match.job.id} match={match} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Great! You have strong matches for immediate opportunities. 
                    Check the Now Jobs tab to see roles you can apply for today.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => router.push('/career/skills?' + (searchParams?.toString() || ''))}
            variant="outline"
            className="flex-1"
          >
            Edit Skills
          </Button>
          <Button 
            onClick={() => router.push('/career')}
            variant="outline"
            className="flex-1"
          >
            New Search
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}