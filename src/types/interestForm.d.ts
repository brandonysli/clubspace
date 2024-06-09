import { Prisma, InterestForm as InterestFormType } from "@prisma/client";

// For creating a new InterestForm
export type InterestFormData = {
  email: string;
  description?: string;
  clubOfficer: boolean;
  addClubInfo: boolean;
};

export type InterestForm = InterestFormType;
