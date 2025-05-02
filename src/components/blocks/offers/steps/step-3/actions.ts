"use server";

import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { z } from "zod";

const stepThreeSchema = z.object({
  whoAmI: z
    .string()
    .min(200, "Le déroulé doit contenir au moins 200 caractères."),
});

export type StepThreeResponse = OfferError<{
  whoAmI?: string[];
}>;

export async function generateStepThree(offer: Offer, formData: FormData) {
  const whoAmI = formData.get("whoAmI") as string;

  const validationResult = stepThreeSchema.safeParse({ whoAmI });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs: RecursivePartial<Offer> = {
    offerJson: { generated: { whoAmI } },
  };

  return runPromptAndSaveOffer(
    getIncludedPrompt(inputs),
    offer,
    inputs,
    "included"
  );
}

const getIncludedPrompt = (offer: RecursivePartial<Offer>) => {
  return `Je veux que tu m'aides à remplir la partie de mon formulaire qui reprend l'ensemble des éléments de mon offre.
Ce format doit lister tous les livrables que le prospect obtiendra en achetant mon offre.

Voici un exemple pour t'aider à identifier la typologie d'éléments entre [ et ].  
Tu dois impérativement t'en inspirer mais ne pas le copier.  
Tu dois être exhaustif dans la description de manière percutante, concis mais descriptif.  
Tu dois faire des phrases courtes.  
Les phrases doivent commencer par ce caractère spécial : ✔︎

[
✔︎ Un rendez-vous individuel de 45min avec moi toutes les 2 semaines.
✔︎ L'accès à des centaines de contenu d'expertise LinkedIn pour t'améliorer.
✔︎ L'accès à un formulaire de correction de publications LinkedIn illimité.
✔︎ L'accès à ma ligne WhatsApp individuelle pour répondre à toutes tes questions.
✔︎ L'intégration à un groupe WhatsApp collectif de discussion.
✔︎ L'intégration à un groupe collectif d'engagement LinkedIn.
✔︎ Un tableau de bord entièrement personnalisé.
]

Voici également pour t'inspirer de la structure, ce que j'attends en termes d'éléments, entre /// et ///.
///
✔︎ Écrire ici... Exemple : Audit complet de votre présence digitale actuelle.
✔︎ Écrire ici... Exemple : Élaboration d'une stratégie de contenu personnalisée.
✔︎ Écrire ici... Exemple : Gestion de vos réseaux sociaux avec création de contenus engageants.
✔︎ Écrire ici... Exemple : Optimisation SEO de votre site web pour un meilleur référencement.
✔︎ Écrire ici... Exemple : Reporting mensuel détaillé avec analyses et recommandations.
///

FORMAT ATTENDU :
Tu ne dois pas mettre d'émojis.
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.

Voici mon offre exacte entre < et >, exploite ces éléments.
<
${offer.offerJson?.generated?.whoAmI}

${offer.offerJson?.generated?.steps}
>`;
};
