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
Tu es un expert en storytelling. Tu sais parfaitement identifier les points forts d'une personne et les éléments qui rendent légitime et crédible une personne par rapport à une offre.
Ton rôle sera d'identifier les éléments les plus pertinents de mon CV liés à l'offre que je vais te partager.

INSTRUCTIONS :
Tu vas devoir identifier et rédiger les éléments de légitimité de l'offre.  
Les personnes qui liront cet élément doivent se dire "Cette personne est la bonne personne pour résoudre mon problème".

1. Le retour généré doit commencer par : "Je m'appelle [Prénom Nom] et je suis [votre fonction], spécialisé(e) en [votre expertise]".
Exemple : "Je m'appelle Kevin Dumont, et j'aide les développeurs freelance à trouver des clients grâce à LinkedIn."

2. Ensuite, tu saute une ligne et tu rédige une phrase percutante qui résume ton parcours et ton expertise, avec le plus possible de preuves sociales.
Exemple : "En moins d'un an, j'ai transformé LinkedIn en machine à clients pour les devs."

3. Ensuite, tu dois rédiger une description concise, percutante et sous forme de checklist avec un tiret "-" devant chaque élément :
Exemple d'élément de la liste :  
"- J'ai accompagné +180 SaaS (dont Airbnb, Stripe, Shopify, etc.) dans leur marketing digital et boosté leurs ventes de 58% en moyenne."

4. Tu passera une ligne puis tu rédigera une sorte de conclusion pour mettre en valeur le fait que tu es la personne qu'ils cherchent.
Exemple de conclusion :  
"En bref, je connais parfaitement les enjeux des freelances tech pour avoir été moi-même dans leurs chaussures, et je les aide à attirer les bons clients grâce à du contenu qui convertit."

5. Je vais te donner un exemple complet entre <<< et >>>. Ça doit parfaitement correspondre parfaitement à la structure attendue.

6. Je vais te donner mon CV entre ((( et ))).  

7. Je vais te donner mon offre actuelle, pour laquelle tu dois mettre en valeur mon "Qui suis-je", entre [[[ et ]]]

DONNÉES :
<<<
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
- Tu ne dois pas utiliser d'émojis.  
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Tu dois t'inspirer de la structure de l'exemple fourni entre <<< et >>> et du ton employé.
- Tu dois impérativement faire attention à ne pas reprendre les éléments de l'exemple fourni entre <<< et >>>, seulement t'inspirer.  
- Tu dois lister au moins 10 points pertinents.  
- Tu dois principalement donner des chiffres pour appuyer tes propos, si c'est possible.  
- Tu dois faire des phrases courtes, concises et percutantes, sans manquer d'informations.  
- Tu dois commencer les phrases par des chiffres quand c'est possible.
- Reste le plus factuel possible en fonction de mon CV, n'invente pas.
- Le retour ne doit contenir que ce qui est demandé, au même format que le texte entre <<< et >>>.  
`;
};
