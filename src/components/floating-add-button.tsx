"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, BookPlus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from '@/hooks/use-toast';


export function FloatingAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleActionClick = (action: string) => {
    toast({
        title: `إضافة ${action}`,
        description: `سيتم فتح نموذج لإضافة ${action} جديد.`
    });
    setIsOpen(false);
  }

  const menuItems = [
    { label: "عميل", icon: UserPlus, action: () => handleActionClick("عميل") },
    { label: "مقال", icon: BookPlus, action: () => handleActionClick("مقال") },
    { label: "مهارة", icon: Star, action: () => handleActionClick("مهارة") },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative flex flex-col-reverse items-center gap-2">
            {/* Main FAB button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                  <Button 
                      size="icon" 
                      className="rounded-full w-14 h-14 shadow-lg relative z-10"
                      onClick={() => setIsOpen(!isOpen)}
                  >
                      <Plus className={cn("h-6 w-6 transition-transform duration-300", isOpen && "rotate-45")} />
                  </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                  <p>{isOpen ? 'إغلاق' : 'إضافة جديدة'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Sub-buttons container */}
            {isOpen && (
              <div className="flex flex-col-reverse gap-2">
                {menuItems.map((item, index) => (
                    <div
                        key={item.label}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                        }}
                    >
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    className="rounded-full w-12 h-12 bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80"
                                    onClick={item.action}
                                >
                                    <item.icon className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>إضافة {item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </TooltipProvider>
  );
}
