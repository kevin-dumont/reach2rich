import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/FormContext";

export function StepNine() {
  const { formData, updateFormData } = useForm();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Résultat final
        </label>
        <Textarea
          className="mt-2"
          value={formData.finalResult}
          onChange={(e) => updateFormData({ finalResult: e.target.value })}
          rows={20}
        />
      </div>
    </div>
  );
}
