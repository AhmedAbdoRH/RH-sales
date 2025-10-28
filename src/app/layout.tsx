import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserCircle, Settings, Users, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/components/auth-provider';
import { FloatingAddButton } from '@/components/floating-add-button';

export const metadata: Metadata = {
  title: 'مركز محترفي المبيعات',
  description: 'لوحة التحكم الخاصة بمساعد المبيعات الشخصي.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', 'dark')}>
        <FirebaseClientProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen w-full">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-40">
                     <Link href="/" className="flex items-center gap-2 font-semibold">
                         <svg
                            className="size-8 shrink-0 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            />
                            <path
                            d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-lg">مركز المبيعات</span>
                    </Link>
                    <div className="flex-1">
                        {/* Future home for breadcrumbs or global search */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">الإعدادات</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <UserCircle className="h-5 w-5" />
                            <span className="sr-only">الملف الشخصي</span>
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 pb-20">{children}</main>
                 <FloatingAddButton />
                 <footer className="border-t bg-background/95 backdrop-blur-sm mt-auto">
                    <div className="container mx-auto flex h-16 items-center justify-center gap-4 px-4">
                        <Button variant="ghost" asChild>
                            <Link href="/customers" className="flex flex-col h-auto items-center gap-1">
                                <Users className="h-5 w-5" />
                                <span className="text-xs">كل العملاء</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/skills" className="flex flex-col h-auto items-center gap-1">
                                <Star className="h-5 w-5" />
                                <span className="text-xs">كل المهارات</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/knowledge-base" className="flex flex-col h-auto items-center gap-1">
                                <BookOpen className="h-5 w-5" />
                                <span className="text-xs">كل الردود</span>
                            </Link>
                        </Button>
                    </div>
                 </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
