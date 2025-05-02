import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { useActionState } from "react";
import { generateStepTen, StepTenResponse } from "./actions";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { redirect } from "next/navigation";
import { toast } from "sonner";
const initialState: StepTenResponse = {};

export function StepTen() {
  const { offer, setStep, isLoading } = useForm();

  const [state, formAction, pending] = useActionState(
    async (prevState: StepTenResponse, formData: FormData) => {
      if (!offer) return prevState;

      const result = await generateStepTen(offer, formData);

      if (result?.updatedOffer) {
        toast.success("Offre créée avec succès");
        redirect(`/dashboard/offers/${offer.id}`);
      }

      return result;
    },
    initialState
  );

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="doNothing">
            Résultat de l&apos;étape 9 (Si tu ne fais rien)
          </Label>
          <Textarea
            rows={12}
            name="doNothing"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.doNothing}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.doNothing,
            })}
          />
          <FormMessage error={state?.inputErrors?.doNothing} />
        </div>

        <FormFooter
          pending={pending}
          isGenerated={!!offer?.offerJson?.generated?.fillTheForm}
          goToNextStep={() => setStep(8)}
        />
      </div>
    </form>
  );
}
