'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, ArrowRight, Edit } from 'lucide-react';

function SkillsContent() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load initial skills from URL params
    const skillsParam = searchParams?.get('skills');
    
    if (skillsParam) {
      setSkills(skillsParam.split(',').filter(Boolean));
    }

    // Load available skills for suggestions
    fetch('/api/career/skills')
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setAvailableSkills(data.skills.map((s: { name: string }) => s.name));
        }
      })
      .catch(console.error);
  }, [searchParams]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const findMatches = async () => {
    if (skills.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/career/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills })
      });
      
      if (response.ok) {
        const { matches } = await response.json();
        const params = new URLSearchParams({
          skills: skills.join(','),
          matches: JSON.stringify(matches)
        });
        router.push(`/career/results?${params}`);
      }
    } catch (error) {
      console.error('Match error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedSkills = availableSkills
    .filter(skill => !skills.includes(skill))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Skills Inventory</h1>
          <p className="text-gray-600">
            Review and edit your skills. Add any missing skills that represent your experience.
          </p>
        </div>

        {/* Current Skills */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Your Skills ({skills.length})
            </CardTitle>
            <CardDescription>
              These skills will be used to match you with relevant job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="default" className="px-3 py-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-500"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-gray-500 italic">No skills added yet. Add some skills below.</p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., Project Management, Python, Excel)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button onClick={addSkill} disabled={!newSkill.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Skills */}
        {suggestedSkills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Suggested Skills</CardTitle>
              <CardDescription>
                Common skills you might want to add to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    {skill}
                    <Plus className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={findMatches}
            disabled={skills.length === 0 || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Finding Matches...' : 'Find Job Matches'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SkillsContent />
    </Suspense>
  );
}