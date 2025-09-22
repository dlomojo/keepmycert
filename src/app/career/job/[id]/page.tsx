'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, DollarSign, TrendingUp, CheckCircle, AlertCircle, Award, ExternalLink } from 'lucide-react';
import { Job, Credential } from '@/lib/career-db';

interface JobDetailProps {
  params: Promise<{ id: string }>;
}

function JobDetailContent({ params }: JobDetailProps) {
  const [jobId, setJobId] = useState<string>('');
  const [job, setJob] = useState<Job | null>(null);
  const [matchScore, setMatchScore] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle async params
    params.then(({ id }) => setJobId(id));
  }, [params]);

  useEffect(() => {
    if (!jobId) return;
    
    const fetchJobDetails = async () => {
      try {
        const skills = searchParams?.get('skills')?.split(',') || [];
        
        const response = await fetch('/api/career/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, userSkills: skills })
        });
        
        if (response.ok) {
          const data = await response.json();
          setJob(data.job);
          setMatchScore(data.matchScore);
          setMatchedSkills(data.matchedSkills);
          setMissingSkills(data.missingSkills);
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, searchParams]);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatSalary(job.medianSalaryUsd)}
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {job.growthOutlook} Growth
                </span>
                <Badge variant="outline">{job.seniority}</Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(matchScore * 100)}%
              </div>
              <div className="text-sm text-gray-500">Match Score</div>
              <Progress value={matchScore * 100} className="w-24 mt-2" />
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{job.description}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Matched Skills ({matchedSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <Badge key={skill} className="bg-green-100 text-green-800 border-green-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                Missing Skills ({missingSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-orange-300 text-orange-700">
                    {skill}
                  </Badge>
                ))}
                {missingSkills.length === 0 && (
                  <p className="text-green-600 font-medium">✓ You have all required skills!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {recommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Recommended Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((cred) => (
                  <div key={cred.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{cred.name}</h4>
                      <Badge variant="outline" className="text-xs">{cred.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cred.provider}</p>
                    <p className="text-sm text-gray-700 mb-3">{cred.description}</p>
                    <Button size="sm" variant="outline" className="w-full"
                            onClick={() => window.open(cred.url, '_blank')}>
                      Learn More <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Back to Results
          </Button>
          <Button onClick={() => router.push('/career')} className="flex-1 bg-blue-600 hover:bg-blue-700">
            New Search
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage({ params }: JobDetailProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <JobDetailContent params={params} />
    </Suspense>
  );
}