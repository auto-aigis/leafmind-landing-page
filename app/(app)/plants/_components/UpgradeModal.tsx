"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UpgradeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-200">
        <DialogHeader>
          <DialogTitle>Upgrade to LeafMind Pro</DialogTitle>
          <DialogDescription>
            You've added 2 plants — upgrade to add unlimited plants
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-2">✓</span>
              <span>Unlimited plant profiles</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-2">✓</span>
              <span>Full chat history for each plant</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-2">✓</span>
              <span>Priority AI responses</span>
            </li>
          </ul>
          <Link href="/pricing" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              See Pricing Plans
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
