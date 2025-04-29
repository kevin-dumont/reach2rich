import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/FormContext";

export function StepThree() {
  const { formData, updateFormData } = useForm();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Résultat de l&apos;étape 2
        </label>
        <Textarea
          className="mt-2"
          value={formData.stepTwoResult}
          onChange={(e) => updateFormData({ stepTwoResult: e.target.value })}
          rows={12}
        />
      </div>
    </div>
  );
}
