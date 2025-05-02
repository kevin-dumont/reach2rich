"use server";

import { z } from "zod";
import { merge } from "@/lib/objects/merge";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";

const stepNineSchema = z.object({
  painPoints: z
    .string()
    .min(200, "Le champ 'painPoints' doit contenir au moins 200 caractères."),
});

export type StepNineResponse = OfferError<{
  painPoints?: string[];
}>;

export async function generateStepNine(
  offer: Offer,
  formData: FormData
): Promise<StepNineResponse> {
  const painPoints = formData.get("painPoints") as string;

  const validationResult = stepNineSchema.safeParse({ painPoints });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([offer, { offerJson: { generated: { painPoints } } }]);

  return runPromptAndSaveOffer(
    getFillTheFormVsDoNothing(inputs),
    offer,
    inputs,
    "doNothing"
  );
}

function getFillTheFormVsDoNothing(offer: Offer) {
  return `TON RÔLE :
Tu es un expert en copywriting spécialisé dans les pages de vente à haute conversion.

CONTEXTE :
Je vais te donner un bloc de contenu avec des éléments à exploiter entre <<< et >>>.
L'objectif à terme est de faire une section intitulée : "Si tu ne fais rien" et une autre intitulée : "Si tu remplis ce formulaire".
Le but est de les mettre en opposition et inciter le lecteur à passer à l'action.
On ne va pas le faire le bloc "Si tu remplis ce formulaire" pour l'instant, mais c'est pour te donner le contexte.

INSTRUCTIONS :
Ton objectif est de transformer le contenu entre <<< et >>> en une section intitulée : "Si tu ne fais rien".

1. Reste simple, brut, direct.  
2. Utilise des phrases concrètes, visuelles, réalistes.  
3. Dans le bloc "Tu ne fais rien", mets l'accent sur la perte de CA potentielle sous forme de calcul.  
4. Le contenu des phrases doit être un calcul de non rentabilité de l'inaction pour le bloc "Tu ne fais rien".
L'inverse pour le bloc "Tu remplis ce formulaire" qu'on fera plus tard.
5. Tu va respecter le format exact qui se trouve entre les caractères [[[ et ]]] :
6. Tu dois appliuer ça à l'offre qui est entre <<< et >>>
7. Tu trouveras un exemple complet de ce que je te demande entre les caractères ((( et ))) 

DONNÉES :
[[[
↓ Ligne 1  
↓ Ligne 2  
↓ Ligne 3  
↓ Ligne 4  
✘ Ligne 5  

➜ Phrase finale choc, brutale, chiffrée. Doit créer un électrochoc.
]]]

(((
↓ Tu continues à publier dans le vide
↓ Ton profil reste invisible
↓ Tu rates 1 à 2 missions par mois
↓ À 400€/jour, tu perds 8000€/mois
✘ En 3 mois, t’as perdu 24 000€

➜ À l’année, t’as perdu une Tesla Model S
)))

<<<
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
>>>

FORMAT ATTENDU :
- Pas d'émojis, pas de promesses floues, pas de blabla.  
- Mets des points à la fin des phrases.  
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre <<< et >>>.
- Tu dois impérativement t'inspirer de l'exemple mais ne pas le copier.  
`;
}
