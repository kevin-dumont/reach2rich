"use server";

import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { z } from "zod";

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

  const inputs: RecursivePartial<Offer> = {
    offerJson: { userInput: { cv }, generated: { steps: generatedSteps } },
  };

  return runPromptAndSaveOffer(
    getWhoAmIPrompt(inputs),
    offer,
    inputs,
    "whoAmI"
  );
}

const getWhoAmIPrompt = (offer: RecursivePartial<Offer>) => {
  return `Tu es un expert en storytelling. Tu sais parfaitement identifier les points forts d'une personne et les éléments qui rendent légitime et crédible une personne par rapport à une offre.

Ton rôle sera d'identifier les éléments les plus pertinents de mon CV liés à l'offre que je vais te partager.

Tu dois rédiger une description concise, percutante et sous forme de checklist avec un caractère spécial devant chaque élément : ✦

Je vais te donner un exemple de ce à quoi ça doit ressembler.  
Tu dois impérativement faire attention à ne pas reprendre les éléments de cet exemple.  
Tu dois juste t'inspirer de sa structure et du ton employé.

Je vais te donner l'exemple entre /// et ///. Ça doit parfaitement correspondre à la structure attendue.
Je vais te donner mon CV entre < et >.  
Je vais te donner mon offre entre [ et ].

///
Je m'appelle Kevin Dumont, et j'aide les développeurs freelance à trouver des clients grâce à LinkedIn.

En moins d'un an, j'ai transformé LinkedIn en machine à clients pour les devs.

- J'ai accompagné +180 freelances dans l'IT pour trouver des missions, vendre leurs SaaS ou faire de l'apport d'affaires.
- J'ai généré +8 millions d'impressions LinkedIn en seulement 9 mois.
- J'ai construit une audience de +9000 abonnés qualifiés dans la tech.
- J'ai créé une formation LinkedIn dédiée aux développeurs, avec +180 élèves satisfaits.
- J'optimise les profils LinkedIn pour convertir les vues en rendez-vous.
- J'écris des posts efficaces avec l'IA pour maximiser la portée et l'engagement.
- Je booste la visibilité des freelances tech grâce à des stratégies d'engagement ciblées.
- J'ai une expertise concrète du terrain grâce à mon expérience de développeur JS / React chez Warner Bros. Discovery.
- Je maîtrise le copywriting et la vente pour transformer la visibilité en chiffre d'affaires concret.

En bref, je connais parfaitement les enjeux des freelances tech pour avoir été moi-même dans leurs chaussures, et je les aide à attirer les bons clients grâce à du contenu qui convertit.
///

<${offer.offerJson?.userInput?.cv}>

[${offer.offerJson?.userInput?.steps}]

FORMAT ATTENDU :
Tu ne dois pas utiliser d'émojis.  
Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
Tu dois lister au moins 10 points pertinents.  
Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre /// et ///.  

Tu dois principalement donner des chiffres pour appuyer tes propos.  
Tu dois faire des phrases courtes, concises et percutantes, sans manquer d'informations.  
Tu dois commencer les phrases par des chiffres.  
Reste le plus factuel possible en fonction de mon CV.

Je te rappelle l'objectif : identifier et rédiger les éléments de légitimité de l'offre.  
Les personnes qui liront cet élément doivent se dire "Cette personne est la bonne personne".

Commence la checklist par :  
Je m'appelle [Prénom NOM] et je suis [votre fonction], spécialisé(e) en [votre expertise].
Par exemple :  
"Je m'appelle Marie Dupont et je suis consultante en marketing digital, spécialisée dans la stratégie de contenu pour les entreprises technologiques."

Rappelle-toi que mon offre actuelle pour laquelle tu dois mettre en valeur mon "Qui suis-je" et la suite des éléments est la suivante :  
${offer.offerJson?.userInput?.offer}`;
};
