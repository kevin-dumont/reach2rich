"use server";

import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { z } from "zod";

const stepFiveSchema = z.object({
  notIncluded: z
    .string()
    .min(200, "Le champ 'notIncluded' doit contenir au moins 200 caractères."),
});

export type StepFiveResponse = OfferError<{
  notIncluded?: string[];
}>;

export async function generateStepFive(offer: Offer, formData: FormData) {
  const notIncluded = formData.get("notIncluded") as string;

  const validationResult = stepFiveSchema.safeParse({ notIncluded });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs: RecursivePartial<Offer> = {
    offerJson: { generated: { notIncluded } },
  };

  return runPromptAndSaveOffer(
    getDoneForYouPrompt(inputs),
    offer,
    inputs,
    "doneForYou"
  );
}

const getDoneForYouPrompt = (offer: RecursivePartial<Offer>) => {
  return `Prends le rôle d'un expert en copywriting qui utilise les dernières techniques de rédaction et au maximum du state of art.

J'ai créé une landing page sur laquelle je vais renvoyer mon audience pour les convertir.

Tu trouveras tous les détails de mon programme entre ces caractères spéciaux, ce qui te permettra d'en déduire les cibles pour la rédaction des éléments suivants < et > :
<
Qui suis-je ?
${offer.offerJson?.generated?.whoAmI}

Le déroulé du programme :
${offer.offerJson?.generated?.steps}

Ce que comprend l'offre :
${offer.offerJson?.generated?.included}

Ce que ne comprend pas l'offre :
${offer.offerJson?.generated?.notIncluded}
>

Exploite ces détails pour rédiger le bloc qui répond à l'affirmation suivante :
Cette offre est faite pour vous si…

Le format attendu est :  
✔︎ Cible N°1 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Aux startups technologiques souhaitant augmenter leur notoriété pour attirer des investisseurs mais n'y arrivent pas.)  
✔︎ Cible N°2 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Aux PME du secteur numérique cherchant à booster leurs ventes en ligne mais ne savent pas comment faire.)

...jusqu'à 5 cibles différentes.

Consignes :  
- Tu dois impérativement prendre un ton percutant et impactant.  
- Tu ne dois pas utiliser d'émojis.  
- Tu dois formuler des phrases simplement.  
- Tu dois être le plus précis possible sur les problématiques rencontrées.  
- Tu dois formuler des phrases courtes.
- Tu dois impérativement commencer tes lignes par "✔︎ Tu"

Voici un exemple qui correspond parfaitement à la structure attendue entre << et >> :
<<
✔︎ Tu es entrepreneur ou consultant et tu veux générer plus de clients avec LinkedIn, mais tes posts ne convertissent pas. Tu publies, tu engages, mais au final, zéro prospect qualifié.  
✔︎ Tu es expert dans ton domaine, mais tu galères à créer une offre qui attire et vend. Ton audience ne comprend pas ta valeur, et tes posts passent inaperçus.  
✔︎ Tu as déjà suivi une formation LinkedIn, mais ça n'a rien changé. Trop de théorie, pas d'accompagnement concret, et toujours aucune vente générée.  
✔︎ Tu veux devenir une figure d'autorité sur LinkedIn, mais tu ne sais pas comment structurer un contenu percutant. Tu veux être visible, reconnu et respecté pour ton expertise.  
✔︎ Tu veux décrocher des clients avec LinkedIn sans publicité, sans cold emailing et sans prospecter comme un forcené. Tu veux que tes posts génèrent des leads en automatique.
>>

FORMAT ATTENDU :
Tu ne dois pas mettre d'émojis.
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
`;
};
