"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateStepThree(deroule: string, quiSuisJe: string) {
  const prompt = `Je veux que tu m'aides à remplir la partie de mon formulaire qui reprend l'ensemble des éléments de mon offre.

Ces éléments sont compris sous 2 formats.

Format N°1 : Ce que comprend cette offre/programme/masterclass.  
Ce format doit lister tous les livrables que le prospect obtiendra en achetant mon offre.

Voici un exemple pour t'aider à identifier la typologie d'éléments entre [ et ].  
Tu dois impérativement t'en inspirer mais ne pas le copier.  
Tu dois être exhaustif dans la description de manière percutante, concis mais descriptif.  
Tu dois faire des phrases courtes.  
Les phrases doivent commencer par ce caractère spécial : ✔︎

[
⬇︎ Ce que comprend ce programme...

✔︎ Un rendez-vous individuel de 45min avec moi toutes les 2 semaines.
✔︎ L'accès à des centaines de contenu d'expertise LinkedIn pour t'améliorer.
✔︎ L'accès à un formulaire de correction de publications LinkedIn illimité.
✔︎ L'accès à ma ligne WhatsApp individuelle pour répondre à toutes tes questions.
✔︎ L'intégration à un groupe WhatsApp collectif de discussion.
✔︎ L'intégration à un groupe collectif d'engagement LinkedIn.
✔︎ Un tableau de bord entièrement personnalisé.
]

Format N°2 : Ce que NE comprend PAS cette offre/programme/masterclass.  
Ce format doit lister tous les livrables que ma prestation ne comprend pas en achetant mon offre pour éviter tout malentendu.  
Tu dois impérativement lister les livrables potentiels auxquels le prospect s'attend mais qui ne seront pas compris dans l'offre.

Voici un exemple pour t'aider à identifier la typologie d'éléments entre [[[ et ]]].  
Tu dois impérativement t'en inspirer mais ne pas le copier.  
Tu dois être exhaustif dans la description de manière percutante, concis mais descriptif.  
Tu dois faire des phrases courtes.  
Les phrases doivent commencer par ce caractère spécial : ✘

[[[
⬇︎ Ce que ne comprend pas ce programme...
✘ Un papounet qui va te chouchouter.
✘ Une énième formation LinkedIn magique.
✘ Des supports de formations avec des conseils.
✘ Une stratégie toute prête à ton arrivée.
✘ Un 0 de plus sur ton compte sans rien faire.
✘ Des masterclass avec des experts.
]]]

Voici également pour t'inspirer de la structure, ce que j'attends en termes d'éléments, entre /// et ///.

///
⬇︎ Ce que comprend cette offre.
✔︎ Écrire ici... Exemple : Fonctionnalité N°1 (Audit complet de votre présence digitale actuelle.)
✔︎ Écrire ici... Exemple : Fonctionnalité N°2 (Élaboration d'une stratégie de contenu personnalisée.)
✔︎ Écrire ici... Exemple : Fonctionnalité N°3 (Gestion de vos réseaux sociaux avec création de contenus engageants.)
✔︎ Écrire ici... Exemple : Fonctionnalité N°4 (Optimisation SEO de votre site web pour un meilleur référencement.)
✔︎ Écrire ici... Exemple : Fonctionnalité N°5 (Reporting mensuel détaillé avec analyses et recommandations.)

⬇︎ Ce que ne comprend pas cette offre.
✘ Écrire ici... Exemple : Élément N°1 (La création ou la refonte complète de votre site web.)
✘ Écrire ici... Exemple : Élément N°2 (Les dépenses publicitaires (elles seront facturées séparément).)
✘ Écrire ici... Exemple : Élément N°3 (La gestion des relations presse ou des événements physiques.)
✘ Écrire ici... Exemple : Élément N°4 (Le support technique pour des problèmes non liés au marketing.)
✘ Écrire ici... Exemple : Élément N°5 (Les formations approfondies pour vos équipes (disponibles en option).)
///

Tu ne dois pas mettre d'émojis.

Voici mon offre exacte entre < et >, exploite ces éléments.

<
${quiSuisJe}

${deroule}
>`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content;
}
