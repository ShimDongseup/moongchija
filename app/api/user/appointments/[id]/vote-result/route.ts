import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { DfGetVoteResultUseCase } from "@/application/usecases/vote/DfGetVoteResultUsecase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;
    const appointmentId = id;

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const voteResultUseCase = new DfGetVoteResultUseCase(
      new SbTimeVoteUserRepository(),
      new SbPlaceVoteUserRepository(),
      new SbAppointmentRepository(),
      new SbTimeVoteRepository(),
      new SbPlaceVoteRepository()
    );

    const voteResult = await voteResultUseCase.execute(appointmentId);

    return NextResponse.json(voteResult);
  } catch (error) {
    console.error("❌ 투표 결과 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
