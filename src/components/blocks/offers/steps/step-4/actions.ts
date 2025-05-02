"use server";

import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { z } from "zod";

const stepFourSchema = z.object({
  included: z
    .string()
    .min(200, "Le contenu du programme doit contenir au moins 200 caractères."),
});

export type StepFourResponse = OfferError<{
  included?: string[];
}>;

export async function generateStepFour(offer: Offer, formData: FormData) {
  const included = formData.get("included") as string;

  const validationResult = stepFourSchema.safeParse({ included });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs: RecursivePartial<Offer> = {
    offerJson: { generated: { included } },
  };

  return runPromptAndSaveOffer(
    getInNotInPrompt(inputs),
    offer,
    inputs,
    "notIncluded"
  );
}

const getInNotInPrompt = (offer: RecursivePartial<Offer>) => {
  return `Je veux que tu m'aides à remplir la partie de mon formulaire qui reprend l'ensemble des éléments que ne contient PAS mon offre.

Ce que NE comprend PAS cette offre.  
Ce format doit lister tous les livrables que ma prestation ne comprend pas en achetant mon offre pour éviter tout malentendu.  
Tu dois impérativement lister les livrables potentiels auxquels le prospect s'attend mais qui ne seront pas compris dans l'offre.

Voici un exemple pour t'aider à identifier la typologie d'éléments entre [[[ et ]]].  
Tu dois impérativement t'en inspirer mais ne pas le copier.  
Tu dois être exhaustif dans la description de manière percutante, concis mais descriptif.  
Tu dois faire des phrases courtes.  
Les phrases doivent commencer par ce caractère spécial : ✘

[[[
✘ Un papounet qui va te chouchouter.
✘ Une énième formation LinkedIn magique.
✘ Des supports de formations avec des conseils.
✘ Une stratégie toute prête à ton arrivée.
✘ Un 0 de plus sur ton compte sans rien faire.
✘ Des masterclass avec des experts.
]]]

Voici également pour t'inspirer de la structure, ce que j'attends en termes d'éléments, entre /// et ///.
///
✘ Écrire ici... Exemple : La création ou la refonte complète de votre site web.
✘ Écrire ici... Exemple : Les dépenses publicitaires (elles seront facturées séparément).
✘ Écrire ici... Exemple : La gestion des relations presse ou des événements physiques.
✘ Écrire ici... Exemple : Le support technique pour des problèmes non liés au marketing.
✘ Écrire ici... Exemple : Les formations approfondies pour vos équipes (disponibles en option).
///

FORMAT ATTENDU :
Tu ne dois pas mettre d'émojis.
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.

Voici mon offre exacte entre < et >, exploite ces éléments.
<
Qui suis-je ?
${offer.offerJson?.generated?.whoAmI}

Le déroulé de l'offre :
${offer.offerJson?.generated?.steps}
>

Je vais également te mettre ici ce qui est inclus dans mon offre entre < et >
<
${offer.offerJson?.generated?.included}
>
`;
};
