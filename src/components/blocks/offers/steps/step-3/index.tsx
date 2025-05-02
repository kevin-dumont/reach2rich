import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { cn } from "@/lib/utils";
import { generateStepThree, StepThreeResponse } from "./actions";

const initialState: StepThreeResponse = {};

export function StepThree() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepThree);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="whoAmI">
            Résultat de l&apos;étape 2 (Qui suis-je ? )
          </Label>
          <Textarea
            rows={12}
            name="whoAmI"
            loading={isLoading}
            defaultValue={offer?.offerJson?.generated?.whoAmI}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.whoAmI,
            })}
          />
          <FormMessage error={state?.inputErrors?.whoAmI} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(2)}
          isGenerated={!!offer?.offerJson?.generated.included}
          goToNextStep={() => setStep(4)}
        />
      </div>
    </form>
  );
}
