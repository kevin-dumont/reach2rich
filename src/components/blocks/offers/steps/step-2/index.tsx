import { useActionState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";

import { generateStepTwo, StepTwoResponse } from "./actions";
import { FormMessage } from "../../form-message";
import { useStepAction } from "@/hooks/use-step-action";

const initialState: StepTwoResponse = {};

export function StepTwo() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepTwo);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="generatedSteps">
            Voici le déroulé de l&apos;offre :
          </Label>
          <Textarea
            rows={8}
            loading={isLoading}
            name="generatedSteps"
            defaultValue={offer?.offerJson?.generated?.steps}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.generatedSteps,
            })}
          />
          <FormMessage error={state?.inputErrors?.generatedSteps} />
        </div>

        <FormFooter
          pending={pending}
          isGenerated={!!offer?.offerJson?.generated.whoAmI}
          onPreviousClick={() => setStep(1)}
          goToNextStep={() => setStep(3)}
        />
      </div>
    </form>
  );
}
