'use client';

import { useState, useEffect } from 'react';
import type { Skill } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

const cardColors = [
  'bg-card-pink',
  'bg-card-blue',
  'bg-card-purple',
  'bg-card-green',
  'bg-card-orange',
];

const SkillCard = ({ skill, className, isVisible }: { skill: Skill; className?: string; isVisible: boolean }) => (
  <Card className={cn(
    "flex flex-col h-full justify-center transition-opacity duration-500 ease-in-out",
    isVisible ? 'opacity-100' : 'opacity-0',
    className
  )}>
    <CardContent className="p-4 whitespace-nowrap">
      <div className="flex items-baseline gap-2 text-right">
        <h3 className="text-base font-bold shrink-0">{skill.title}:</h3>
        <p className="text-sm text-card-foreground">{skill.description}</p>
      </div>
    </CardContent>
  </Card>
);

export function ScrollingSkills() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const skillsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'skills'));
  }, [firestore, user]);

  const { data: skills, isLoading } = useCollection<Skill>(skillsQuery);

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false); // Start fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
        setIsVisible(true); // Start fade in
      }, 500); // Time for fade out transition
    }, 5000); // Change skill every 5 seconds

    return () => clearInterval(interval);
  }, [skills]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Skeleton className="h-20 w-80" />
      </div>
    );
  }

  const sortedSkills = skills
    ? [...skills].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  const currentSkill = sortedSkills[currentIndex];

  if (!currentSkill) {
    return (
        <div className="flex justify-center items-center h-20">
            <p>لا توجد مهارات لعرضها.</p>
        </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-20">
        <SkillCard 
            skill={currentSkill} 
            className={cn(cardColors[currentIndex % cardColors.length])}
            isVisible={isVisible}
        />
    </div>
  );
}
