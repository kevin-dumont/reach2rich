"use server";

import { z } from "zod";

import { Offer, OfferError } from "@/types/offer";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { RecursivePartial } from "@/types/utility";

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

  const inputs: RecursivePartial<Offer> = {
    offerJson: { userInput: { offer, steps } },
  };

  return runPromptAndSaveOffer(
    getPrompt(inputs as Offer),
    _offer,
    inputs,
    "steps"
  );
}

function getPrompt(offer: Offer) {
  return `Tu es un expert business et marketing.

  J'attends de toi que tu structures un déroulé d'offre avec les phases clés du programme, qui doivent correspondre à ce que je vais te donner entre ces caractères < >.
  
  Tu dois impérativement concevoir les différentes phases de la façon expliquée entre << et >>.
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

  Voici un exemple complet avec toutes les phase entre <<< et >>>.
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
  
  FORMAT ATTENDU :
  Tu dois mettre autant de phases qu'il y en a dans mon offre.  
  Tu dois faire des phrases courtes.
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
  L'objectif est que ce soit clair et limpide pour le potentiel client.  
  Il doit tout comprendre.  
  Évite le jargon trop technique.
  
  <${offer.offerJson.userInput.steps}>
  
  Rappelle-toi que mon offre actuelle pour laquelle tu dois créer la suite des éléments est la suivante :

  ${offer.offerJson.userInput.offer}`;
}
