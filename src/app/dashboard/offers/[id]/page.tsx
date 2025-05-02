"use server";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchOfferData } from "@/services/supabase/offers/offerRepository";

export default async function ViewOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await fetchOfferData(id as string);

  return (
    <Card className="col-span-8 p-6">
      <h1 className="text-2xl font-bold">{offer?.name}</h1>

      <Label htmlFor="painPoints">Tu te reconnais là dedans ?</Label>
      <Textarea
        name="painPoints"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.painPoints}
      />

      <Label htmlFor="whoAmI">Qui suis-je ?</Label>
      <Textarea
        name="whoAmI"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.whoAmI}
      />

      <Label htmlFor="doneForYou">Cette offre est faite pour vous si...</Label>
      <Textarea
        name="doneForYou"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.doneForYou}
      />

      <Label htmlFor="notDoneForYou">
        Cette offre n&apos;est pas faite pour vous si...
      </Label>
      <Textarea
        name="notDoneForYou"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.notDoneForYou}
      />

      <Label htmlFor="steps">Le déroulé de l&apos;offre :</Label>
      <Textarea
        name="steps"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.steps}
      />

      <Label htmlFor="included">Ce que comprend cette offre :</Label>
      <Textarea
        name="included"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.included}
      />

      <Label htmlFor="notIncluded">Ce que ne comprend pas cette offre :</Label>
      <Textarea
        name="notIncluded"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.notIncluded}
      />

      <Label htmlFor="doNothing">Si tu ne fais rien :</Label>
      <Textarea
        name="doNothing"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.doNothing}
      />

      <Label htmlFor="fillTheForm">Si tu remplis ce formulaire :</Label>
      <Textarea
        name="fillTheForm"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.fillTheForm}
      />

      <Label htmlFor="FAQ">Les questions fréquentes :</Label>
      <Textarea
        name="FAQ"
        className="mt-2"
        rows={12}
        value={offer?.offerJson.generated.FAQ}
      />
    </Card>
  );
}
