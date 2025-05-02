"use server";

import { merge } from "@/lib/objects/merge";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { z } from "zod";

const stepSixSchema = z.object({
  doneForYou: z
    .string()
    .min(
      200,
      "Le champ 'fait pour toi' doit contenir au moins 200 caractères."
    ),
});

export type StepSixResponse = OfferError<{
  done?: string[];
}>;

export async function generateStepSix(offer: Offer, formData: FormData) {
  const doneForYou = formData.get("doneForYou") as string;

  const validationResult = stepSixSchema.safeParse({ doneForYou });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([offer, { offerJson: { generated: { doneForYou } } }]);

  return runPromptAndSaveOffer(
    getNotDoneForYouPrompt(inputs),
    offer,
    inputs,
    "notDoneForYou"
  );
}

const getNotDoneForYouPrompt = (offer: Offer) => {
  return `Prends le rôle d'un expert en copywriting qui utilise les dernières techniques de rédaction et au maximum du state of art.

J'ai créé une landing page sur laquelle je vais renvoyer mon audience pour les convertir.

Tu trouveras tous les détails de mon programme entre ces caractères spéciaux, ce qui te permettra d'en déduire les cibles pour la rédaction des éléments suivants < et > :
<
${offer.offerJson?.generated?.whoAmI}

${offer.offerJson?.generated?.steps}

Ce qui est inclut dans l'offre :
${offer.offerJson?.generated?.included}

Ce qui n'est pas inclus dans l'offre :
${offer.offerJson?.generated?.notIncluded}

Cette offre est faite pour vous si…
${offer.offerJson?.generated?.doneForYou}
>

Exploite ces détails pour rédiger le bloc qui répond à l'affirmation suivante :
Cette offre n'est pas faite pour vous si…

Le format attendu est :  
✘ Exemple : Cible N°1 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Vous cherchez uniquement à externaliser sans implication interne et vous y arrivez très bien.)  
✘ Exemple : Cible N°2 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Les organisations dont l'objectif principal est de réduire leurs coûts plutôt que d'investir dans la croissance et arrivent à augmenter leur CA.)

...jusqu'à 5 cibles différentes.

Consignes :  
- Tu dois impérativement prendre un ton percutant et impactant.  
- Tu ne dois pas utiliser d'émojis.  
- Tu dois formuler des phrases simplement.  
- Tu dois être le plus précis possible sur les problématiques rencontrées.  
- Tu dois formuler des phrases courtes.
- Tu dois impérativement commencer tes lignes par "✘ Tu"

Voici un exemple qui correspond parfaitement à la structure attendue entre << et >> :
<<
✘ Tu penses que LinkedIn ne sert qu'au réseautage et qu'il est impossible d'y faire du business.  
✘ Tu n'as aucune expertise exploitable et aucune idée de ce que tu peux vendre.  
✘ Tu ne veux pas apprendre à vendre. Tu attends que les clients viennent à toi sans effort.  
✘ Tu ne veux pas publier sur LinkedIn. Tu cherches juste quelqu'un pour gérer ton compte à ta place.  
✘ Tu refuses d'adapter ton business model pour réussir sur LinkedIn. Tu veux que ça fonctionne sans rien changer.  
>>

FORMAT ATTENDU :
- Tu ne dois pas mettre d'émojis.
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre << et >>`;
};
