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
  return `TON RÔLE :
Tu es un expert en copywriting spécialisé dans les pages de vente à haute conversion.

CONTEXTE :
Je vais te donner un bloc de contenu avec des éléments à exploiter entre <<< et >>>.
L'objectif à terme est de faire une section intitulée : "Si tu ne fais rien" et une autre intitulée : "Si tu remplis ce formulaire".
Le but est de les mettre en opposition et inciter le lecteur à passer à l'action.
Le bloc "Si tu ne fais rien" est déjà fait pour cette offre et est compris entre {{{ et }}}, tu dois faire le bloc "Si tu remplis ce formulaire".

INSTRUCTIONS :
Ton objectif est de transformer le contenu entre <<< et >>> en une section intitulée : "Si tu remplis ce formulaire".

1. Reste simple, brut, direct.  
2. Utilise des phrases concrètes, visuelles, réalistes.  
3. Dans le bloc "Tu remplis ce formulaire", mets l'accent sur l'accès à une opportunité réelle.  
4. Le contenu des phrases doit être un calcul de rentabilité de l'action pour le bloc "Tu remplis ce formulaire".
5. Tu va respecter le format exact qui se trouve entre les caractères [[[ et ]]] :
6. Tu dois appliquer ça à l'offre qui est entre <<< et >>>
7. Tu trouveras un exemple complet de ce que je te demande entre ((( et ))) 

DONNÉES :
[[[
↓ Ligne 1  
↓ Ligne 2  
↓ Ligne 3  
↓ Ligne 4  
✔︎ Ligne 5  

➜ Phrase finale positive, motivante, chiffrée. Doit inciter à l'action.
]]]

{{{
${offer.offerJson?.generated?.doNothing}
}}}

(((
↓ On clarifie ton positionnement
↓ Ton profil attire les bons clients
↓ Tu publies du contenu qui convertit
↓ Tu décroches des missions sous 2 à 3 mois
✔︎ Tu construis un canal d’acquisition rentable

➜ Une mission peut rembourser l’accompagnement
)))

<<<
Tu te reconnais là dedans ?
${offer.offerJson?.generated?.painPoints}

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
>>>

FORMAT ATTENDU :
- Pas d'émojis, pas de promesses floues, pas de blabla.  
- Mets des points à la fin des phrases.  
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre <<< et >>>.
- Tu dois impérativement t'inspirer de l'exemple mais ne pas le copier.  
`;
}
