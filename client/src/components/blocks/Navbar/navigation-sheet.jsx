import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/context/AuthContext";

export const NavigationSheet = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-muted"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex w-[280px] flex-col justify-between p-6">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Navigate to different sections of the website</SheetDescription>
        </VisuallyHidden>

        <div className="space-y-8">
          <div onClick={() => handleNavigation("/")} className="cursor-pointer">
            <Logo />
          </div>

          {/* --- ADDED: Navigation Links for Mobile --- */}
          <div className="space-y-2 flex flex-col items-start">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/rnd")}
            >
              R&D
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/verify-log")}
            >
              Verify Log
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/support")}
            >
              Support
            </Button>
          </div>
        </div>

        {!user && (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => handleNavigation("/login")}
            >
              Sign In
            </Button>
            <Button className="w-full rounded-full" onClick={() => handleNavigation("/signup")}>
              Get Started
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
