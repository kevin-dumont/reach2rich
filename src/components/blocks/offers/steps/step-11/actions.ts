"use server";

import { z } from "zod";
import { merge } from "@/lib/objects/merge";

import { Offer, OfferError } from "@/types/offer";
import { updateOffer } from "@/services/supabase/offers/offerRepository";

const stepElevenSchema = z.object({
  fillTheForm: z
    .string()
    .min(200, "Le champ 'fillTheForm' doit contenir au moins 200 caractères."),
});

export type StepElevenResponse = OfferError<{
  fillTheForm?: string[];
}>;

export async function saveOffer(
  offer: Offer,
  formData: FormData
): Promise<StepElevenResponse> {
  const fillTheForm = formData.get("fillTheForm") as string;

  const validationResult = stepElevenSchema.safeParse({ fillTheForm });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([offer, { offerJson: { generated: { fillTheForm } } }]);

  try {
    const updatedOffer = await updateOffer(inputs);

    if (!updatedOffer) {
      return {
        error: "Erreur lors de la mise à jour de l'offre",
      };
    }

    return {
      error: undefined,
      inputErrors: undefined,
      updatedOffer,
    };
  } catch {
    return {
      error: "Une erreur inconnue est survenue, veuillez réessayer plus tard.",
    };
  }
}
