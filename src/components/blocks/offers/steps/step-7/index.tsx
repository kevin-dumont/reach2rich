import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { generateStepSeven, StepSevenResponse } from "./actions";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";

const initialState: StepSevenResponse = {};

export function StepSeven() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepSeven);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="pourToiOuNon">
            Résultat de l&apos;étape 6 (Cette offre n&apos;est pas faite pour
            vous si…)
          </Label>
          <Textarea
            rows={12}
            name="notDoneForYou"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.notDoneForYou}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.notDoneForYou,
            })}
          />
          <FormMessage error={state?.inputErrors?.notDoneForYou} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(6)}
          isGenerated={!!offer?.offerJson?.generated.FAQ}
          goToNextStep={() => setStep(8)}
        />
      </div>
    </form>
  );
}
