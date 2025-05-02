"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signInWithEmail } from "./actions";

const initialState = {
  type: "success",
  message: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithEmail,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <Card className="w-full max-w-md bg-card border-border/40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reach2Rich</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connectez-vous avec la même adresse email que vous avez utilisée
            pour la méthode Reach2Rich.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" action={formAction}>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="nom@exemple.com"
                  className="pl-10 bg-background border-border/40"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>

              {state?.message && (
                <p
                  className={cn("text-sm", {
                    "text-destructive": state.type === "error",
                    "text-green-500": state.type === "success",
                  })}
                >
                  {state.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full button-gradient"
              disabled={pending}
              loading={pending}
            >
              Recevoir le lien de connexion
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
