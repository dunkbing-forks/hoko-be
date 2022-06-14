export class BaseController {
  protected toJson(
    data: any,
    otherInfo: { message?: string; status?: string } = {}
  ): any {
    return {
      data,
      message: otherInfo.message || "",
      status: otherInfo.status || "success",
    };
  }
}
