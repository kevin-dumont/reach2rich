"use server";

import { z } from "zod";
import { merge } from "@/lib/objects/merge";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";

export type StepTwoResponse = OfferError<{
  cv?: string[];
  generatedSteps?: string[];
}>;

const stepTwoSchema = z.object({
  cv: z.string().min(50, "Le CV doit contenir au moins 50 caractères."),
  generatedSteps: z
    .string()
    .min(50, "Le résultat de l'étape 1 doit contenir au moins 50 caractères."),
});

export async function generateStepTwo(
  offer: Offer,
  formData: FormData
): Promise<StepTwoResponse> {
  const cv = formData.get("cv") as string;
  const generatedSteps = formData.get("generatedSteps") as string;

  const validationResult = stepTwoSchema.safeParse({ cv, generatedSteps });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([
    offer,
    { offerJson: { userInput: { cv }, generated: { steps: generatedSteps } } },
  ]);

  return runPromptAndSaveOffer(
    getWhoAmIPrompt(inputs),
    offer,
    inputs,
    "whoAmI"
  );
}

const getWhoAmIPrompt = (offer: Offer) => {
  return `TON RÔLE :
Tu es un expert en storytelling et en copywriting. Tu sais parfaitement identifier les points forts d'une personne et les éléments qui rendent légitime et crédible une personne par rapport à une offre.
Ton rôle sera d'identifier les éléments les plus pertinents de mon CV liés à l'offre que je vais te partager.

INSTRUCTIONS :
Tu vas devoir identifier et rédiger les éléments de légitimité de l'offre.  
Les personnes qui liront cet élément doivent se dire "Cette personne est la bonne personne pour résoudre mon problème".

1. Tu dois être ultra direct.  
2. Le retour généré doit respecter la même structure que l'exemple entre <<< et >>>
3. Tu dois impérativement faire attention à ne pas reprendre les éléments de cet exemple.  
4. Tu dois juste t'inspirer de sa structure et du ton employé.
5. Je vais te donner mon CV entre ((( et ))), qui te donnera le contexte afin que tu puisses rédiger des éléments de légitimité pertinents. Ne mets rien qui ne soit pas en rapport avec mon offre.
6. Tu dois mettre en valeur mon "Qui suis-je?" grâce à mon offre actuelle qui est entre les caractères [[[ et ]]]
7. Les éléments doivent être rédigés de manière percutante, brute, visuelle, sans enrobage.

DONNÉES :
<<<
Je m’appelle Ruben Taieb et je suis expert LinkedIn pour les indépendants.

En 5 ans, j'ai exploré LinkedIn sous tous ses angles.

- J'ai fait du Coaching LinkedIn 1:1.
- J'ai accompagné +100 entreprises. (Back market, Amazon, Century21, Aircall, Unilever, Toshiba...)
- J'ai pivoté en Agence de prospection. (450 comptes sous gestion & 1,5M d'invitations envoyées...)
- J'ai donné +100 conférences LinkedIn.
- J'ai formé +1000 personnes sur LinkedIn.
- J'ai écrit +2000 publications pour des dirigeants.
- J'ai fait +20 campagnes d'influence sur LinkedIn.

Et aujourd'hui, je vous partage tous mes secrets pour contrètement augmenter votre CA.
>>>

(((
${offer.offerJson?.userInput?.cv}
)))

[[[
L'offre :
${offer.offerJson?.userInput?.offer}

Le déroulé de l'offre :
${offer.offerJson?.userInput?.steps}
]]]

FORMAT ATTENDU :
- Le retour doit être exactement comme dans l'exemple entre <<< et >>>, c'est à dire :
  - commencer par 1 phrase séparée par un saut de ligne (ex: "Je m'appelle [Prenom Nom], et je suis spécilisé dans [domaine] pour [cible]")
  - puis un saut de ligne,
  - puis une phrase deuxième phrase ultra percutante qui montre de la crédibilité et légitimité par rapport à l'offre (ex: "En 8 mois, j'ai aidé 200+ freelances à faire de LinkedIn leur canal d'acquisition n°1")
  - puis un saut de ligne,
  - puis la liste dont chaque point commence par un "-",
  - puis un saut de ligne,
  - puis une phrase de conclusion ultra percutante et courte (ex: "En bref, ")
  - Tu dois principalement donner des chiffres pour appuyer tes propos.  
- Tu ne dois pas utiliser d'émojis.  
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Tu dois impérativement faire attention à ne pas reprendre les éléments de l'exemple fourni entre <<< et >>>, seulement copier la structure et d'inspirer du ton.  
- Tu dois lister au moins 8 points pertinents.  
- Tu dois faire des phrases courtes, concises et percutantes, sans manquer d'informations.  
- Tu dois parler au passé le plus possible dans les points de la liste (Ex: "J'ai formé +200 freelance", "J'ai généré +8 millions d'impressions LinkedIn", "J'ai accompagné +180 freelances dans l'IT", "J'ai créé une formation LinkedIn dédiée aux développeurs")
- Reste le plus factuel possible en fonction de mon CV, n'invente pas, par contre embellis.
`;
};
