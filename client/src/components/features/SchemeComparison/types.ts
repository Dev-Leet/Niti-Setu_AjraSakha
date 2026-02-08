export interface ComparisonScheme {
  id: string;
  name: string;
  benefits: {
    financial: {
      amount: number;
    };
  };
  eligibility: string[];
  deadline?: string;
}

export interface SchemeComparisonProps {
  schemes: ComparisonScheme[];
}