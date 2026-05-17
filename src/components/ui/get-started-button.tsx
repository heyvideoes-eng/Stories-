import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button 
        onClick={onClick}
        className="group relative overflow-hidden bg-red-950 hover:bg-red-900 text-white border border-red-800/50 rounded-full px-12 py-8 text-xl tracking-[0.3em] uppercase transition-all duration-500 shadow-[0_0_30px_rgba(185,28,28,0.2)] hover:shadow-[0_0_50px_rgba(185,28,28,0.4)]" 
        size="lg"
    >
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        Enter the Gate
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-full z-10 grid w-1/4 place-items-center transition-all duration-500 bg-white/10 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-white">
        <ChevronRight size={24} strokeWidth={2} aria-hidden="true" />
      </i>
    </Button>
  );
}
