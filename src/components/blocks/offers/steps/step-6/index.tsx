import { useActionState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { cn } from "@/lib/utils";

import { generateStepSix, StepSixResponse } from "./actions";

const initialState: StepSixResponse = {};

export function StepSix() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepSix);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="doneForYou">
            Résultat de l&apos;étape 5 (Cette offre est faite pour vous si…)
          </Label>
          <Textarea
            rows={12}
            name="doneForYou"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.doneForYou}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.doneForYou,
            })}
          />
          <FormMessage error={state?.inputErrors?.doneForYou} />
        </div>

        <FormFooter
          pending={pending}
          isGenerated={!!offer?.offerJson?.generated.notDoneForYou}
          goToNextStep={() => setStep(7)}
        />
      </div>
    </form>
  );
}
