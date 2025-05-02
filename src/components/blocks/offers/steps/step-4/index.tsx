import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { cn } from "@/lib/utils";
import { generateStepFour, StepFourResponse } from "./actions";

const initialState: StepFourResponse = {};

export function StepFour() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepFour);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="included">Ce que comprend ce programme :</Label>
          <Textarea
            rows={12}
            name="included"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.included}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.included,
            })}
          />
          <FormMessage error={state?.inputErrors?.included} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(3)}
          isGenerated={!!offer?.offerJson?.generated.notIncluded}
          goToNextStep={() => setStep(5)}
        />
      </div>
    </form>
  );
}
