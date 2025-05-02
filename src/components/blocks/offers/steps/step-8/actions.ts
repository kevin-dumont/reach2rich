"use server";

import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { z } from "zod";

const stepEightSchema = z.object({
  FAQ: z
    .string()
    .min(200, "Le champ 'FAQ' doit contenir au moins 200 caractères."),
});

export type StepEightResponse = OfferError<{
  FAQ?: string[];
}>;

export async function generateStepEight(
  offer: Offer,
  formData: FormData
): Promise<StepEightResponse> {
  const FAQ = formData.get("FAQ") as string;

  const validationResult = stepEightSchema.safeParse({ FAQ });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs: RecursivePartial<Offer> = {
    offerJson: { generated: { FAQ } },
  };

  return runPromptAndSaveOffer(
    getPainPointsPrompt(inputs),
    offer,
    inputs,
    "painPoints"
  );
}

const getPainPointsPrompt = (offer: RecursivePartial<Offer>) => {
  return `TON RÔLE :
Tu es un expert copywriter.

CONTEXTE :
Je suis en train de rédiger le copywriting d'une landing pour une offre, dont le contenu est entre <<< et >>>.

INSTRUCTIONS :
1. Étudie le contenu de l'offre que j'ai déjà rédigé entre <<< et >>>.  
2. Garde uniquement les éléments qui décrivent des situations concrètes, répétitives et pénibles que vit ma cible.  
3. Reformule-les de manière percutante, brute, visuelle, sans enrobage.  
4. Ajoute aussi leurs limites actuelles : excuses, tentatives échouées, blocages mentaux.  
5. Termine la section par une phrase choc, brutale, qui met un coup de pression.
6. Tu trouveras le format attendu entre les caractères ((( et ))):
7. Tu trouveras un exemple déjà parfaitement rédigé de ce que je souhaite obtenir entre [[[ et ]]] :

DONNÉES :
(((
- Puce 1  
- Puce 2  
- ...  
- ...  
- ...  
- ...  
- ...  

Phrase finale choc.
)))

[[[
- Tu regardes des devs moins bons que toi décrocher des missions grâce à LinkedIn.
- Tu procrastines sur ton positionnement parce que "faut que je réfléchisse encore un peu".
- T'as l'impression de parler dans le vide à chaque post.
- Tu crois ne rien avoir à dire, alors tu postes pas.
- Tu t'es convaincu que LinkedIn c'est pour les influenceurs, pas pour toi.
- T'essaies des trucs au pif, sans stratégie, sans plan, sans résultat.
- Tu t'es promis de t'y mettre "sérieusement"... depuis 6 mois.

Pendant ce temps, d'autres prennent ta place.
]]]

<<<
Qui suis-je ?
${offer.offerJson?.generated?.whoAmI}

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
- Tu ne dois pas mettre d'émojis.
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Tu dois être ultra direct.  
- Écrire des phrases courtes.  
- Créer un effet miroir : la personne doit se dire "c'est exactement moi".  
- Ne surtout pas vendre ici.  
- Ne pas mettre d'intro ni de conclusion (à part la punchline finale).  
- Utiliser un format liste à puces brutales.`;
};
