"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoWithText from "@/components/ui/logo-with-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <LogoWithText size="lg" />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Oooops, page non trouvée</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-10">
            Désolé, la page que vous cherchez n&apos;existe pas.
          </p>

          <Button size="lg">
            <Link href="/">Retourner à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
