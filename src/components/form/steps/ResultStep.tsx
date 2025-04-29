import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "../types";

interface ResultStepProps extends StepProps {
  stepNumber: number;
  fieldName: keyof StepProps["formData"];
}

export function ResultStep({
  formData,
  onChange,
  stepNumber,
  fieldName,
}: ResultStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Résultat de l&apos;étape {stepNumber}
        </label>
        <Textarea
          className="mt-2"
          value={formData[fieldName]}
          readOnly
          rows={12}
        />
      </div>
    </div>
  );
}
