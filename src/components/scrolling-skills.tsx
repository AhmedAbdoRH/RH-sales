'use client';

import type { Skill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';

const cardColors = [
  'bg-card-pink',
  'bg-card-blue',
  'bg-card-purple',
  'bg-card-green',
  'bg-card-orange'
];

const SkillCard = ({ skill, className }: { skill: Skill; className?: string }) => (
  <Card className={cn("flex flex-col h-full", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
      <CardTitle className="text-base font-medium">{skill.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0 flex-grow">
      <p className="text-sm text-card-foreground">{skill.description}</p>
    </CardContent>
  </Card>
);

export function ScrollingSkills() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const skillsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'skills'));
  }, [firestore, user]);

  const { data: skills, isLoading } = useCollection<Skill>(skillsQuery);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-72 shrink-0" />
        ))}
      </div>
    );
  }

  const sortedSkills = skills
    ? [...skills].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  // Duplicate skills for a seamless loop
  const skillsToRender = [...sortedSkills, ...sortedSkills];

  return (
    <div
      className="w-full inline-flex flex-nowrap overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 200px), transparent 100%)',
      }}
    >
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll-horizontal">
        {skillsToRender.map((skill, idx) => (
            <li key={`${skill.id}-${idx}`} className='w-72 shrink-0'>
                <SkillCard skill={skill} className={cn(cardColors[idx % cardColors.length])} />
            </li>
        ))}
      </ul>
    </div>
  );
}
