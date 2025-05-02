interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">
        Étape {currentStep} sur {totalSteps}
      </h2>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="bg-black h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
