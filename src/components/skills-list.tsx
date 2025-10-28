"use client";

import type { Skill } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addSkill, deleteSkill, updateSkill } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from './ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function SkillsList() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const skillsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'skills');
  }, [firestore, user]);

  const { data: skills, isLoading } = useCollection<Skill>(skillsQuery);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;

    const formData = new FormData(event.currentTarget);
    const title = formData.get('description') as string; // Use description as title
    const description = formData.get('description') as string;

    if (!description) {
        toast({ title: "خطأ", description: "الوصف مطلوب.", variant: "destructive" });
        return;
    }
    
    if (dialogMode === 'edit' && selectedSkill) {
      updateSkill(firestore, selectedSkill.id, { title, description });
      toast({ title: "تم تحديث المهارة", description: `تم تحديث مهارة "${title}".` });
    } else {
      addSkill(firestore, { title, description });
      toast({ title: "تمت إضافة المهارة", description: `تمت إضافة مهارة "${title}" بنجاح.` });
    }
    
    setDialogOpen(false);
    setSelectedSkill(null);
  };

  const handleAddClick = () => {
    setDialogMode('add');
    setSelectedSkill(null);
    setDialogOpen(true);
  };

  const handleEditClick = (skill: Skill) => {
    setDialogMode('edit');
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  const handleDeleteClick = (skillId: string) => {
    setSkillToDelete(skillId);
  };
  
  const handleConfirmDelete = () => {
    if (firestore && skillToDelete) {
      deleteSkill(firestore, skillToDelete);
      toast({
        title: "تم حذف المهارة",
        variant: "destructive",
      });
      setSkillToDelete(null);
    }
  };

  const showLoading = isLoading || isUserLoading;

  const sortedSkills = skills 
    ? [...skills].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddClick}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة مهارة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showLoading && (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        )}
        {!showLoading && sortedSkills.map((skill) => (
          <Card key={skill.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <CardTitle className="text-xl">{skill.title}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">فتح القائمة</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleEditClick(skill)}>تعديل</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteClick(skill.id)}>حذف</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{skill.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'edit' ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'edit' ? 'قم بتحديث تفاصيل المهارة أدناه.' : 'املأ تفاصيل المهارة أدناه.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">الوصف</Label>
                <Textarea id="description" name="description" defaultValue={selectedSkill?.description} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{dialogMode === 'edit' ? 'حفظ التغييرات' : 'حفظ المهارة'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
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
    </>
  );
}
