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
      <div className="fixed bottom-8 left-8 z-50">
        <div className="relative flex flex-col-reverse items-center gap-2">
            {isOpen && menuItems.map((item, index) => (
                <Tooltip key={item.label} delayDuration={0}>
                    <TooltipTrigger asChild>
                         <Button
                            size="icon"
                            className="rounded-full w-12 h-12 bg-secondary text-secondary-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-secondary/80"
                            style={{
                                transform: `translateY(-${(index + 1) * 3.5}rem)`,
                                transitionDelay: `${index * 50}ms`,
                                opacity: isOpen ? 1 : 0,
                                zIndex: -1
                            }}
                            onClick={item.action}
                        >
                            <item.icon className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>إضافة {item.label}</p>
                    </TooltipContent>
                </Tooltip>
            ))}


          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Button 
                    size="icon" 
                    className="rounded-full w-14 h-14 shadow-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus className={cn("h-6 w-6 transition-transform duration-300", isOpen && "rotate-45")} />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>{isOpen ? 'إغلاق' : 'إضافة جديدة'}</p>
            </TooltipContent>
          </Tooltip>

        </div>
      </div>
    </TooltipProvider>
  );
}
