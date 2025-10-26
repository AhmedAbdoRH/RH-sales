"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

const salesSkills = [
  "Active Listening: Understand customer needs before presenting solutions.",
  "Rapport Building: Connect with clients on a personal level to build trust.",
  "Value Proposition: Clearly articulate how your product solves the client's problem.",
  "Objection Handling: Address concerns with confidence and provide reassurance.",
  "Closing Techniques: Know when and how to ask for the sale.",
  "Follow-up: Persistence pays off. Stay in touch with prospects.",
];

export function SkillReminder() {
  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    // Set initial skill without waiting for interval
    setCurrentSkill(salesSkills[0]);

    const interval = setInterval(() => {
      // Use a functional update to get the latest skill and avoid dependency issues.
      setCurrentSkill(prevSkill => {
        const currentIndex = salesSkills.indexOf(prevSkill);
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
        <Lightbulb className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Sales Skill Tip:</span>{" "}
          {currentSkill}
        </p>
      </div>
    </footer>
  );
}
