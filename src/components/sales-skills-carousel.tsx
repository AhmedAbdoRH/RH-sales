'use client';

import type { Skill } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteSkill, updateSkill, moveSkill } from '@/lib/data';
import { Button } from './ui/button';
import { Pencil, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function SalesSkillsCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const skillsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'skills'));
  }, [firestore, user]);

  const { data: skills, isLoading } = useCollection<Skill>(skillsQuery);
  
  const handleEditClick = (e: React.MouseEvent, skill: Skill) => {
    e.stopPropagation();
    setSelectedSkill(skill);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    setSkillToDelete(skillId);
  };
  
  const handleConfirmDelete = () => {
    if (firestore && skillToDelete && sortedSkills) {
      deleteSkill(firestore, skillToDelete, sortedSkills);
      toast({
        title: "تم حذف المهارة",
      });
      setSkillToDelete(null);
    }
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !selectedSkill) return;

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    if (!title || !description) {
        toast({ title: "خطأ", description: "العنوان والوصف مطلوبان.", variant: "destructive" });
        return;
    }
    
    updateSkill(firestore, selectedSkill.id, { title, description });
    toast({ title: "تم تحديث المهارة", description: `تم تحديث "${title}".` });
    
    setEditDialogOpen(false);
    setSelectedSkill(null);
  };

  const handleMove = (skillId: string, direction: 'left' | 'right') => {
    if (firestore && sortedSkills) {
       moveSkill(firestore, sortedSkills, skillId, direction);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-32 w-1/3" />
        <Skeleton className="h-32 w-1/3" />
        <Skeleton className="h-32 w-1/3" />
      </div>
    );
  }

  const sortedSkills = skills 
    ? [...skills].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  return (
    <>
        <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
        <CarouselContent>
            {sortedSkills?.map((skill, idx) => (
            <CarouselItem key={skill.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-base font-medium">{skill.title}</CardTitle>
                        <div className="flex items-center">
                             <Button variant="ghost" size="icon" onClick={() => handleMove(skill.id, 'right')} disabled={idx === 0}>
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">تحريك لليمين</span>
                              </Button>
                               <Button variant="ghost" size="icon" onClick={() => handleMove(skill.id, 'left')} disabled={idx === sortedSkills.length - 1}>
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">تحريك لليسار</span>
                              </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, skill)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">تعديل</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => handleDeleteClick(e, skill.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        </Carousel>
        
        <AlertDialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المهارة بشكل دائم.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
            <form onSubmit={handleFormSubmit}>
                <DialogHeader>
                <DialogTitle>تعديل المهارة</DialogTitle>
                <DialogDescription>
                    قم بتحديث تفاصيل المهارة أدناه.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">المهارة</Label>
                    <Input id="title" name="title" defaultValue={selectedSkill?.title} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">الوصف</Label>
                    <Textarea id="description" name="description" defaultValue={selectedSkill?.description} className="col-span-3" required/>
                </div>
                </div>
                <DialogFooter>
                <Button type="submit">حفظ التغييرات</Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
    </>
  );
}
