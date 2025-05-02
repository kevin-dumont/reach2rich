import { useActionState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { cn } from "@/lib/utils";

import { generateStepFive, StepFiveResponse } from "./actions";

const initialState: StepFiveResponse = {};

export function StepFive() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepFive);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="doneForYou">
            Résultat de l&apos;étape 4 (Ce que ne comprend pas cette offre)
          </Label>
          <Textarea
            rows={12}
            name="notIncluded"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.notIncluded}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.notIncluded,
            })}
          />
          <FormMessage error={state?.inputErrors?.notIncluded} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(4)}
          isGenerated={!!offer?.offerJson?.generated.doneForYou}
          goToNextStep={() => setStep(5)}
        />
      </div>
    </form>
  );
}
