"use server";

import * as z from "zod";

import { createClient } from "@/config/supabase/server";

export async function signInWithEmail(_: any, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const validatedFields = formSchema.safeParse({ email });

  if (!validatedFields.success) {
    return errorResponse(MESSAGES.INVALID_EMAIL);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: validatedFields.data.email,
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return errorResponse(MESSAGES.RATE_LIMIT);
    }
    return errorResponse(MESSAGES.ERROR);
  }
  return successResponse(MESSAGES.SUCCESS);
}

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

const MESSAGES = {
  SUCCESS: "Un lien de connexion vous a été envoyé à votre adresse email.",
  ERROR: "Une erreur est survenue lors de la connexion.",
  RATE_LIMIT:
    "Pour des raisons de sécurité, nous limitons le nombre de demandes de connexion par adresse email. Veuillez réessayer plus tard.",
  INVALID_EMAIL: "Veuillez entrer une adresse email valide.",
};

const errorResponse = (message: string) => {
  return { type: "error", message };
};

const successResponse = (message: string) => {
  return { type: "success", message };
};
