export interface FormData {
  offer: string;
  steps: string;
  stepOneResult: string;
  cv: string;
  stepTwoResult: string;
  stepThreeResult: string;
  stepFourResult: string;
  stepFiveResult: string;
  stepSixResult: string;
  stepSevenResult: string;
  finalResult: string;
}

export interface StepProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}