"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import { salesSkills } from "@/lib/skills";

export function SkillReminder() {
  const [currentSkill, setCurrentSkill] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    // Set initial skill without waiting for interval
    if (salesSkills.length > 0) {
      setCurrentSkill(salesSkills[0]);
    }

    const interval = setInterval(() => {
      // Use a functional update to get the latest skill and avoid dependency issues.
      setCurrentSkill(prevSkill => {
        if (!prevSkill) return salesSkills[0] || null;
        const currentIndex = salesSkills.findIndex(s => s.title === prevSkill.title);
        const nextIndex = (currentIndex + 1) % salesSkills.length;
        return salesSkills[nextIndex];
      });
    }, 7000); // Change skill every 7 seconds

    return () => clearInterval(interval);
  }, []);

  if (!currentSkill) {
    return null; // Don't render on server or before first skill is set
  }

  return (
    <footer className="sticky bottom-0 z-10 border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-center gap-3 px-4 text-center md:text-left">
        <Lightbulb className="h-5 w-5 shrink-0 text-yellow-400" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">نصيحة في مهارات البيع:</span>{" "}
          <span className="font-medium">{currentSkill.title}:</span> {currentSkill.description}
        </p>
      </div>
    </footer>
  );
}
