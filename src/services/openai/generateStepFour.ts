"use server";

import { openai } from "./openai";

export async function generateStepFour(
  deroule: string,
  quiSuisJe: string,
  inNotIn: string
) {
  const prompt = `Prends le rôle d'un expert en copywriting qui utilise les dernières techniques de rédaction et au maximum du state of art.

J'ai créé une landing page sur laquelle je vais renvoyer mon audience pour les convertir.

Tu trouveras tous les détails de mon programme entre ces caractères spéciaux, ce qui te permettra d'en déduire les cibles pour la rédaction des éléments suivants <> :

<
${quiSuisJe}

${deroule}

${inNotIn}
>

Exploite ces détails pour rédiger les 2 blocs suivants :

Bloc N°1 : ⬇︎ Cette masterclass/offre/programme est faite pour vous si…  
Bloc N°2 : ⬇︎ Cette masterclass/offre/programme n'est pas faite pour vous si…

Pour le Bloc N°1, le format attendu est :  
✔︎ Cible N°1 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Aux startups technologiques souhaitant augmenter leur notoriété pour attirer des investisseurs mais n'y arrivent pas.)  
✔︎ Cible N°2 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Aux PME du secteur numérique cherchant à booster leurs ventes en ligne mais ne savent pas comment faire.)

…jusqu'à 5 cibles différentes.

Pour le Bloc N°2, le format attendu est :  
✘ Exemple : Cible N°1 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Vous cherchez uniquement à externaliser sans implication interne et vous y arrivez très bien.)  
✘ Exemple : Cible N°2 + Objectif + Problèmes ou Échecs ou Réussites ou Obstacles ou Défis ou Opportunités ou Préoccupations ou Besoins ou Tendances ou Attentes ou Limitations ou Aspirations  
(Par exemple : Les organisations dont l'objectif principal est de réduire leurs coûts plutôt que d'investir dans la croissance et arrivent à augmenter leur CA.)

…jusqu'à 5 cibles différentes.

Consignes :  
- Tu dois impérativement prendre un ton percutant et impactant.  
- Tu ne dois pas utiliser d'émojis.  
- Tu dois formuler des phrases simplement.  
- Tu dois être le plus précis possible sur les problématiques rencontrées.  
- Tu dois formuler des phrases courtes.

Voici un exemple pour t'inspirer de la structure (à ne pas copier textuellement) :

(
⬇︎ Ce programme est fait pour toi si…  
✔︎ Tu es entrepreneur ou consultant et tu veux générer plus de clients avec LinkedIn, mais tes posts ne convertissent pas. Tu publies, tu engages, mais au final, zéro prospect qualifié.  
✔︎ Tu es expert dans ton domaine, mais tu galères à créer une offre qui attire et vend. Ton audience ne comprend pas ta valeur, et tes posts passent inaperçus.  
✔︎ Tu as déjà suivi une formation LinkedIn, mais ça n'a rien changé. Trop de théorie, pas d'accompagnement concret, et toujours aucune vente générée.  
✔︎ Tu veux devenir une figure d'autorité sur LinkedIn, mais tu ne sais pas comment structurer un contenu percutant. Tu veux être visible, reconnu et respecté pour ton expertise.  
✔︎ Tu veux décrocher des clients avec LinkedIn sans publicité, sans cold emailing et sans prospecter comme un forcené. Tu veux que tes posts génèrent des leads en automatique.

⬇︎ Ce programme n'est pas fait pour toi si…  
✘ Tu penses que LinkedIn ne sert qu'au réseautage et qu'il est impossible d'y faire du business.  
✘ Tu n'as aucune expertise exploitable et aucune idée de ce que tu peux vendre.  
✘ Tu ne veux pas apprendre à vendre. Tu attends que les clients viennent à toi sans effort.  
✘ Tu ne veux pas publier sur LinkedIn. Tu cherches juste quelqu'un pour gérer ton compte à ta place.  
✘ Tu refuses d'adapter ton business model pour réussir sur LinkedIn. Tu veux que ça fonctionne sans rien changer.  
)`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content;
}
