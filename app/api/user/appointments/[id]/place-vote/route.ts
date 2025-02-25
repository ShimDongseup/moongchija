import { NextRequest, NextResponse } from "next/server";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { DfGetPlaceVotesUsecase } from "@/application/usecases/vote/DfGetPlaceVotesUsecase";

export const GET = async (request: NextRequest) => {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const getPlaceVotesUsecase = new DfGetPlaceVotesUsecase(
      new SbPlaceVoteRepository()
    );
    const places = await getPlaceVotesUsecase.execute(appointmentId);

    return NextResponse.json(places);
  } catch (error) {
    console.log("❌ 장소 투표 리스트 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
