import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { generateStepEight, StepEightResponse } from "./actions";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";

const initialState: StepEightResponse = {};

export function StepEight() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepEight);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="questions">Les questions fréquentes :</Label>
          <Textarea
            rows={12}
            name="FAQ"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.FAQ}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.FAQ,
            })}
          />
          <FormMessage error={state?.inputErrors?.FAQ} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(7)}
          isGenerated={!!offer?.offerJson?.generated.painPoints}
          goToNextStep={() => setStep(9)}
        />
      </div>
    </form>
  );
}
