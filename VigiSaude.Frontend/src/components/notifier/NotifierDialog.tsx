import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Notifier, NotifierForm } from "@/components/notifier/NotifierForm";

export function NotifierDialog({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved?: (n: Notifier) => void }) {
  const [saving, setSaving] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Identificação do Notificador</DialogTitle>
        </DialogHeader>
        <div>
          <NotifierForm onSaved={(n) => { onSaved?.(n); onOpenChange(false); }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotifierDialog;
