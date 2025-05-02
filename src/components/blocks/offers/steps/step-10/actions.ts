"use server";

import { z } from "zod";
import { merge } from "@/lib/objects/merge";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";

const stepTenSchema = z.object({
  doNothing: z
    .string()
    .min(200, "Le champ 'doNothing' doit contenir au moins 200 caractères."),
});

export type StepTenResponse = OfferError<{
  doNothing?: string[];
}>;

export async function generateStepTen(
  offer: Offer,
  formData: FormData
): Promise<StepTenResponse> {
  const doNothing = formData.get("doNothing") as string;

  const validationResult = stepTenSchema.safeParse({ doNothing });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([offer, { offerJson: { generated: { doNothing } } }]);

  return runPromptAndSaveOffer(
    getFillTheFormVsDoNothing(inputs),
    offer,
    inputs,
    "fillTheForm"
  );
}

function getFillTheFormVsDoNothing(offer: Offer) {
  return `Tu es un expert en copywriting spécialisé dans les pages de vente à haute conversion.  
Je vais te donner un bloc de contenu avec des éléments à exploiter entre ### et ###.

Ton objectif est de transformer ce contenu en une section intitulée :  
⬇︎ Ne rien faire VS Remplir ce formulaire

La partie "Ne rien faire" est déjà rédigée entre << et >> :
<<
${offer.offerJson?.generated?.doNothing}
>>

Pour l'instant, on se concentrer sur le bloc "Si tu remplis ce formulaire" entre << et >> :
<<<
↓ Ligne 1  
↓ Ligne 2  
↓ Ligne 3  
↓ Ligne 4  
✔︎ Ligne 5

➜ Phrase finale douce, positive, désirable. Montre le bénéfice ultime.
>>>

FORMAT ATTENDU :
Tu ne dois pas mettre d'émojis.
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.

Instructions :
- Reste simple, brut, direct.  
- Utilise des phrases concrètes, visuelles, réalistes.  
- Dans le bloc "Tu ne fais rien", mets l'accent sur la perte de CA potentielle sous forme de calcul.  
- Dans le bloc "Tu remplis ce formulaire", mets l'accent sur l'accès à une opportunité réelle.  
- Saute une ligne entre les deux blocs.  
- Pas d'émojis, pas de promesses floues, pas de blabla.  
- Mets des points à la fin des phrases.  
- Le contenu des phrases doit être un calcul de non rentabilité de l'inaction pour le bloc "Tu ne fais rien".  
  L'inverse pour le bloc "Tu remplis ce formulaire".

###
Qui suis-je ?
${offer.offerJson?.generated?.whoAmI}

Cette offre est faite pour vous si :
${offer.offerJson?.generated?.doneForYou}

Le déroulé de l'offre :
${offer.offerJson?.generated?.steps}

Ce que comprend l'offre :
${offer.offerJson?.generated?.included}

Ce que ne comprend pas l'offre :
${offer.offerJson?.generated?.notIncluded}

Cette offre est faite pour vous si :
${offer.offerJson?.generated?.doneForYou}

Cette offre n'est pas faite pour vous si :
${offer.offerJson?.generated?.notDoneForYou}

Les questions fréquentes :
${offer.offerJson?.generated?.FAQ}

Tu te reconnais là dedans ?
${offer.offerJson?.generated?.painPoints}
###`;
}
