export type Offer = {
  id: string;
  name: string;
  createdAt: string;
  offerJson: OfferJson;
  userId: string;
};

export type OfferJson = {
  userInput: {
    offer?: string;
    steps?: string;
    cv?: string;
  };
  generated: {
    steps?: string;
    whoAmI?: string;
    painPoints?: string;
    included?: string;
    notIncluded?: string;
    doNothing?: string;
    fillTheForm?: string;
    PriceVsCost?: string;
    doneForYou?: string;
    notDoneForYou?: string;
    FAQ?: string;
    finalResult?: string;
  };
};

export type OfferError<T extends Record<string, string[]>> = {
  error?: string;
  inputErrors?: T;
  updatedOffer?: Offer;
};
