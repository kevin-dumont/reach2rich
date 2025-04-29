"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export default function NotAuthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center mb-6 gap-2">
        <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground p-2">
          <Logo />
        </div>
        <div className="grid flex-1 text-left text-2xl leading-tight">
          <span className="truncate font-semibold">Reach2Rich</span>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Accès refusé</h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            Il semble que vous n&rsquo;ayez pas encore accès à la méthode
            Reach2Rich avec votre email{" "}
            <span className="font-semibold">{user?.email}</span>
          </p>

          <p className="text-gray-700">
            Si vous avez déjà acheté la méthode, veuillez vous connecter avec le
            même email que celui utilisé pour l&rsquo;achat.
          </p>

          <Button size="lg">
            <Link href="https://rech2rich.systeme.io">Acheter la méthode</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
