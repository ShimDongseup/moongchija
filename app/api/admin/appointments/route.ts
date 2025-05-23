import { NextResponse } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { DfGetAllAppointmentsUsecase } from "@/application/usecases/appointment/DfGetAllAppointmentsUsecase";
import { AppointmentListDto } from "@/application/usecases/appointment/dto/AppointmentListDto";

// ✅ GET: 약속 목록 조회
export const GET = async () => {
  try {
    const appointmentRepo = new SbAppointmentRepository();
    const getAllAppointmentsUseCase = new DfGetAllAppointmentsUsecase(
      appointmentRepo
    );

    const appointments: AppointmentListDto[] =
      await getAllAppointmentsUseCase.execute();

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
