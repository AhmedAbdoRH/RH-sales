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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { addCustomer, addKnowledgeBaseArticle, addSkill } from '@/lib/data';

type DialogType = 'customer' | 'article' | 'skill' | null;

export function FloatingAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleActionClick = (dialogType: DialogType) => {
    setOpenDialog(dialogType);
    setIsOpen(false);
  }

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const phone = formData.get('phone') as string;

    if (!firestore || !name || !email) {
        toast({
            title: "خطأ",
            description: "الاسم والبريد الإلكتروني مطلوبان.",
            variant: "destructive"
        });
        return;
    }
    
    const newCustomer = { name, email, company, phone };
    addCustomer(firestore, newCustomer);
    
    setOpenDialog(null);
    toast({
      title: "تمت إضافة العميل",
      description: `تمت إضافة ${newCustomer.name} إلى قاعدة بياناتك.`,
    });
  };

  const handleAddArticle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());

     if (!firestore || !title || !content || !category) {
        toast({
            title: "خطأ",
            description: "العنوان والمحتوى والفئة مطلوبة.",
            variant: "destructive"
        });
        return;
    }

    addKnowledgeBaseArticle(firestore, { title, content, category, tags });
    setOpenDialog(null);
    toast({ title: "تمت إضافة المقال", description: `تمت إضافة مقال "${title}" بنجاح.` });
  };

  const handleAddSkill = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    if (!firestore || !title || !description) {
        toast({
            title: "خطأ",
            description: "العنوان والوصف مطلوبان.",
            variant: "destructive"
        });
        return;
    }

    addSkill(firestore, { title, description });
    setOpenDialog(null);
    toast({ title: "تمت إضافة المهارة", description: `تمت إضافة مهارة "${title}" بنجاح.` });
  };


  const menuItems = [
    { label: "عميل", icon: UserPlus, action: () => handleActionClick("customer") },
    { label: "مقال", icon: BookPlus, action: () => handleActionClick("article") },
    { label: "مهارة", icon: Star, action: () => handleActionClick("skill") },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative flex flex-col items-center gap-2">
           {isOpen && (
              <div className="flex flex-col-reverse items-center gap-2">
                {menuItems.map((item, index) => (
                    <div
                        key={item.label}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
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
      
      {/* Customer Dialog */}
      <Dialog open={openDialog === 'customer'} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddCustomer}>
              <DialogHeader>
                <DialogTitle>إضافة عميل جديد</DialogTitle>
                <DialogDescription>
                  املأ تفاصيل ملف العميل الجديد. انقر على "حفظ" عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">الاسم</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
                  <Input id="email" name="email" type="email" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">الشركة</Label>
                  <Input id="company" name="company" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">الهاتف</Label>
                  <Input id="phone" name="phone" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ العميل</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
      
      {/* Article Dialog */}
      <Dialog open={openDialog === 'article'} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddArticle}>
              <DialogHeader>
                <DialogTitle>إضافة مقال جديد</DialogTitle>
                <DialogDescription>أضف مقالاً جديداً إلى قاعدة المعرفة.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">العنوان</Label>
                  <Input id="title" name="title" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">المحتوى</Label>
                  <Textarea id="content" name="content" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">الفئة</Label>
                  <Input id="category" name="category" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">الوسوم</Label>
                  <Input id="tags" name="tags" className="col-span-3" placeholder="مبيعات, مفاوضات" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ المقال</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>

      {/* Skill Dialog */}
      <Dialog open={openDialog === 'skill'} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSkill}>
              <DialogHeader>
                <DialogTitle>إضافة مهارة جديدة</DialogTitle>
                <DialogDescription>أضف مهارة مبيعات جديدة للنظام.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">المهارة</Label>
                  <Input id="title" name="title" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">الوصف</Label>
                  <Textarea id="description" name="description" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ المهارة</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
