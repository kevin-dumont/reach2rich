"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoWithText from "@/components/ui/logo-with-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <LogoWithText size="lg" />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Une erreur est survenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-10">
            Désolé, une erreur inattendue s&apos;est produite. <br />
            Veuillez réessayer plus tard.
          </p>

          <Button size="lg">
            <Link href="/">Retourner à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
