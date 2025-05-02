"use server";

import { z } from "zod";

import { Offer, OfferError } from "@/types/offer";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { merge } from "@/lib/objects/merge";

const stepOneSchema = z.object({
  offer: z.string().min(50, "L'offre doit contenir au moins 50 caractères."),
  steps: z
    .string()
    .min(50, "Les étapes doivent contenir au moins 50 caractères."),
});

export type StepOneResponse = OfferError<{
  offer?: string[];
  steps?: string[];
}>;

export async function generateStepOne(
  _offer: Offer,
  formData: FormData
): Promise<StepOneResponse> {
  const offer = formData.get("offer") as string;
  const steps = formData.get("steps") as string;

  const validationResult = stepOneSchema.safeParse({ offer, steps });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([
    _offer,
    { offerJson: { userInput: { offer, steps } } },
  ]);

  return runPromptAndSaveOffer(
    getPrompt(inputs as Offer),
    _offer,
    inputs,
    "steps"
  );
}

function getPrompt(offer: Offer) {
  return `TON RÔLE :
Tu es un expert business et marketing.

INSTRUCTIONS :
J'attends de toi que tu structures un déroulé d'offre avec les phases clés du programme.
Elles doivent correspondre à ce que je vais te donner entre les caractères ((( et ))).

1. Tu dois impérativement concevoir les différentes phases de la façon expliquée entre << et >>.
<<
Phase X (où X est remplacé par le numéro de la phase)  
TITRE (Remplace le titre, il doit être court et percutant)  
- Élément 1  
- Élément 2  
- Élément 3  
- Élément 4  
- Élément 5  
(Les 5 éléments doivent être le détail de ce qu'on va voir dans la phase. Des phrases courtes et percutantes. Remplace "Élément" et ne mets que la phrase.)  
Objectif : (L'objectif doit être clair, concis et mesurable.)  
Durée des rendez-vous : (Si pertinent uniquement, ça dépendra des offres. La durée peut être modifiée par la suite. Mets déjà une idée de ce que ça doit prendre en terme de temps.)  
>>
2. Je vais te donner un exemple complet avec toutes les phases entre <<< et >>>.
3. Tu dois impérativement appliquer cette structure à l'offre suivante entre [[[ et ]]] :

DONNÉES :
<<<
Phase 1
CRÉATION DE VOTRE OFFRE
- Validation de votre niche
- Définition de la proposition de valeur
- Définition des composantes de votre offre
- Définition des objectifs
- Définition du prix
Objectif : Avoir une offre claire et irrésistible.
Durée des rendez-vous : 1h30

Phase 2
CRÉATION DE VOTRE PROFIL LINKEDIN
- Création des textes par rapport à votre offre
- Design du profil par notre équipe
- Mise en place de tous les éléments
- Tracking des résultats
- Itération et optimisation
Objectif : Avoir un profil LinkedIn performant.
Durée des rendez-vous : 1h

Phase 3
CRÉATION DE VOTRE LIGNE ÉDITORIALE
- Dégager toutes les problématiques de votre niche
- Trouver des idées de contenu qui répondent à ces problèmes
- Évaluer la pertinence de chaque idée
- Ajoutez vos propres idées et opinions
- Mettre en place un calendrier de publication
Objectif : Avoir une ligne éditoriale cohérente avec votre offre.
Durée des rendez-vous : 1h

Phase 4
CRÉATION DE VOTRE CONTENU
- Vous apprenez les codes de LinkedIn
- Création de vos premières publication
- Création des carousels, visuels, posts
- On vous écrit 1 post par semaine
- Suivi des performances et optimisation
Objectif : Avoir un contenu performant qui fait des ventes.
Durée des rendez-vous : 1h

Phase 5
PROSPECTION OUTBOUND
- On commencer à récupérer les leads générés par votre contenu
- On va chercher les leads chez vous concurrents
- On vous apprendre à écrire de bons messages de prospection
- On vous montre comment automatiser certains messages de prospection
- On vous montre comment effectuer le suivi
Objectif : Avoir un contenu performant.
Durée des rendez-vous : 1h
>>>

[[[
L'offre :
${offer.offerJson.userInput.offer}
]]]

Le déroulé de l'offre :
(((
${offer.offerJson.userInput.steps}
)))

FORMAT ATTENDU :
- Tu dois mettre autant de phases qu'il y en a dans mon offre.  
- Tu dois faire des phrases courtes.
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- L'objectif est que ce soit clair et limpide pour le potentiel client.  
- Il doit tout comprendre.  
- Évite le jargon trop technique.
- Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre <<< et >>>
- Tu dois impérativement faire attention à ne pas reprendre les éléments de l'exemple fourni entre <<< et >>>, seulement reprendre du format et t'inspirer du ton employé.
`;
}
