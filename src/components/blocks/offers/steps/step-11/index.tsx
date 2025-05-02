import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { useActionState } from "react";
import { saveOffer, StepElevenResponse } from "./actions";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const initialState: StepElevenResponse = {};

export function StepEleven() {
  const { offer, setStep, isLoading } = useForm();

  const [state, formAction, pending] = useActionState(
    async (prevState: StepElevenResponse, formData: FormData) => {
      if (!offer) return prevState;

      const result = await saveOffer(offer, formData);

      if (result?.updatedOffer) {
        toast.success("Offre finalisée avec succès");

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
          <Label htmlFor="fillTheForm">Si tu remplis ce formulaire :</Label>
          <Textarea
            rows={12}
            name="fillTheForm"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.fillTheForm}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.fillTheForm,
            })}
          />
          <FormMessage error={state?.inputErrors?.fillTheForm} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(9)}
          isGenerated={!!offer?.offerJson?.generated?.fillTheForm}
          goToNextStep={() => undefined}
        />
      </div>
    </form>
  );
}
