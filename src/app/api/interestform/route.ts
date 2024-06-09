import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

import { InterestFormData, InterestForm } from "@/types/interestForm";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const data = {
      email: reqBody.email,
      description: reqBody.description,
      clubOfficer: reqBody.clubOfficer,
      addClubInfo: reqBody.addClubInfo,
    } as InterestFormData;

    const form = await prisma.interestForm.findUnique({
      where: { email: data.email },
    });

    if (form) {
      const updatedForm = await prisma.interestForm.update({
        where: { id: form.id },
        data: data,
      });
      return NextResponse.json({ form: updatedForm, status: "update" });
    }

    const newForm = await prisma.interestForm.create({
      data: data,
    });

    return NextResponse.json({ form: newForm, status: "success" });
  } catch (error) {
    return NextResponse.json({ form: null, status: "error" });
  }
}
