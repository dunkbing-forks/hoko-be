export class BaseController {
  protected toJson(data: any, message = "", status = "success"): any {
    return {
      data,
      message,
      status,
    };
  }
}
