"use client";

import { Card } from "@/components/ui/card";
import {
  deleteOffer,
  fetchOfferData,
} from "@/services/supabase/offers/offerRepository";
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Offer } from "@/types/offer";
import { CopyIcon, PencilIcon, TrashIcon, BotIcon } from "lucide-react";
export default function ViewOfferPage() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const fetchedOffer: Offer | null = await fetchOfferData(id as string);

      if (!fetchedOffer?.offerJson?.generated?.fillTheForm) {
        redirect(`/dashboard/offers/${id}/edit`);
      }

      if (fetchedOffer) {
        setOffer(fetchedOffer);
      } else {
        // Handle the case where the offer is not found
        toast.error("Offre non trouvée");
        router.push("/dashboard/offers");
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCopy = () => {
    if (!offer) return;

    const offerText = createOfferText(offer);
    navigator.clipboard.writeText(offerText);
    toast.success("Offre copiée dans le presse-papier");
  };

  const handleDelete = async () => {
    const result = await deleteOffer(offer?.id as string);

    if (result) {
      toast.success("Offre supprimée avec succès");
      setShowDeleteDialog(false);
      router.push("/dashboard/offers");
    } else {
      toast.error("Erreur lors de la suppression de l'offre");
    }
  };

  const handleGeneratePrompt = () => {
    if (!offer) return;

    const prompt = createPrompt(offer);

    navigator.clipboard.writeText(prompt);
    toast.success("Prompt généré et copié dans le presse-papier");
  };

  if (!offer) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          variant="outline"
          onClick={handleGeneratePrompt}
          className="flex-1 md:flex-none w-full sm:w-auto text-sm py-1 px-2"
        >
          <BotIcon className="w-4 h-4" />
          Générer un prompt
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex-1 md:flex-none w-full sm:w-auto text-sm py-1 px-2"
        >
          <CopyIcon className="w-4 h-4" />
          Copier
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/offers/${offer.id}/edit`)}
          className="flex-1 md:flex-none w-full sm:w-auto text-sm py-1 px-2"
        >
          <PencilIcon className="w-4 h-4" />
          Éditer
        </Button>
        <Button
          onClick={() => setShowDeleteDialog(true)}
          className="bg-red-500 text-white flex-1 md:flex-none w-full sm:w-auto text-sm py-1 px-2"
        >
          <TrashIcon className="w-4 h-4" />
          Supprimer
        </Button>
      </div>

      <Card className="col-span-8 p-6">
        <h1 className="text-2xl font-bold w-full text-left">{offer?.name}</h1>

        <h2 className="text-lg font-semibold">↓ Tu te reconnais là dedans ?</h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.painPoints}
        </p>

        <h2 className="mt-4 text-lg font-semibold">↓ Qui suis-je ?</h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.whoAmI}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Cette offre est faite pour vous si...
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.doneForYou}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Cette offre n&apos;est pas faite pour vous si...
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.notDoneForYou}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Le déroulé de l&apos;offre :
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.steps}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Ce que comprend cette offre :
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.included}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Ce que ne comprend pas cette offre :
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.notIncluded}
        </p>

        <h2 className="mt-4 text-lg font-semibold">↓ Si tu ne fais rien :</h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.doNothing}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Si tu remplis ce formulaire :
        </h2>
        <p className="whitespace-pre-line">
          {offer?.offerJson.generated.fillTheForm}
        </p>

        <h2 className="mt-4 text-lg font-semibold">
          ↓ Les questions fréquentes :
        </h2>
        <p className="whitespace-pre-line">{offer?.offerJson.generated.FAQ}</p>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la Suppression</DialogTitle>
            </DialogHeader>
            <p>
              Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                className="mr-2"
              >
                Annuler
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white">
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}

const createOfferText = (offer: Offer) => {
  return `
↓ Tu te reconnais là dedans ?

${offer?.offerJson.generated.painPoints}

↓ Qui suis-je ?

${offer?.offerJson.generated.whoAmI}

↓ Cette offre est faite pour vous si...

${offer?.offerJson.generated.doneForYou}

↓ Cette offre n'est pas faite pour vous si...

${offer?.offerJson.generated.notDoneForYou}

↓ Le déroulé de l'offre :

${offer?.offerJson.generated.steps}

↓ Ce que comprend cette offre :

${offer?.offerJson.generated.included}

↓ Ce que ne comprend pas cette offre :

${offer?.offerJson.generated.notIncluded}

↓ Si tu ne fais rien :

${offer?.offerJson.generated.doNothing}

↓ Si tu remplis ce formulaire :

${offer?.offerJson.generated.fillTheForm}

↓ Les questions fréquentes :

${offer?.offerJson.generated.FAQ}  
  `;
};

const createPrompt = (offer: Offer) => {
  return `Crée une landing page épurée, uniquement en noir, blanc et nuances de gris, pensée pour maximiser la conversion d'une offre d'accompagnement ou de formation à destination d'un public indépendant (freelances, consultants, etc). Utilise Next.js et ShadCN pour générer une structure professionnelle, lisible et rapide à naviguer.

La page doit reposer sur une architecture claire, guidant progressivement le visiteur vers l'action, sans aucune distraction visuelle. Utilise une typographie sobre, des espacements généreux, et des composants ShadCN pour structurer l'ensemble (cards, accordéons, sections, call-to-actions).

Voici le contenu à intégrer dans la landing page :

${createOfferText(offer)}

Structure la landing page comme suit :
1. **Hero section** : titre fort (problème ou transformation), sous-titre clair (valeur de l'offre), call-to-action immédiat.
2. **Identification** : une section "Tu te reconnais ?" ou "Voici pourquoi tu galères" pour créer un lien émotionnel avec le visiteur.
3. **Présentation de l'expert** : éléments de preuve sociale, expérience, résultats concrets, positionnement personnel.
4. **À qui s'adresse l'offre / À qui elle ne s'adresse pas** : pour qualifier et filtrer efficacement les leads.
5. **Contenu du programme** : découpé par phase ou module, avec objectifs clairs pour chaque étape.
6. **Ce que ça comprend / Ce que ça n'inclut pas** : liste précise des livrables, limites de la promesse, cadrage fort.
7. **Coût de l'inaction** : projection des pertes si on ne passe pas à l'action.
8. **Bénéfices directs et transformation attendue** : visualisation claire du "après".
9. **FAQ** : construite pour lever les principales objections à l'achat ou à l'engagement.
10. **Call-to-action final** : simple, direct, orienté prise de rendez-vous ou remplissage de formulaire.

Le ton doit être humain, direct, écrit à la première personne du singulier, sans exagération marketing. Privilégie les phrases courtes, les bullets lisibles, et une logique de conversation claire entre chaque section.

Remplace le contenu par du faux texte réaliste là où nécessaire (ex : "Lorem ipsum" contextuel) mais conserve la structure et les composants adaptés à l'offre qui sera insérée.

Objectif : produire une landing page sobre, professionnelle, convaincante, centrée sur la conversion.`;
};
