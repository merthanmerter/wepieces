import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useParentRoute } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { ChevronsUpDownIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const DELETE_PROMPT = "delete permanently";

export default function DangerZone({
  mutationFn,
}: {
  mutationFn: () => Promise<void>;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const { navigateToParent } = useParentRoute();

  const handleOpen = React.useCallback(() => {
    setOpen((open) => {
      if (!open) {
        setTimeout(() => {
          if (ref.current)
            ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      }
      return !open;
    });

    return () => {
      setOpen(false);
    };
  }, []);

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => navigateToParent({ invalidate: true }),
    // onSuccess: () => window.history.back()
    onError: () => toast.error("error"),
  });

  return (
    <Collapsible
      ref={ref}
      open={open}
      onOpenChange={handleOpen}
      className='bg-background border border-destructive rounded-md'>
      <div className='flex items-center justify-between space-x-4 px-4 text-sm py-2'>
        <h4>Danger Zone</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='w-9 p-0'>
            <ChevronsUpDownIcon className='size-4' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='p-4 bg-background'>
        <p className='text-sm'>
          Please type <code>`{DELETE_PROMPT}`</code> to confirm.
        </p>
        <div className='flex gap-2 items-center mt-2'>
          <Input
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={DELETE_PROMPT}
            className='h-8'
          />
          <Button
            disabled={prompt !== DELETE_PROMPT}
            variant='destructive'
            size='sm'
            onClick={() => {
              if (prompt !== DELETE_PROMPT) return;
              mutation?.mutate();
            }}>
            Delete
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
