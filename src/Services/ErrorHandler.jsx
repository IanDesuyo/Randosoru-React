import toastr from "toastr";

export default function ErrorHandler(error) {
  try {
    console.log(error);
    console.log(error.response);
    toastr.error(error.response.data.detail.msg || error.response.data.detail, "ERROR", {
      closeButton: true,
      positionClass: "toast-bottom-right",
    });
  } catch (e) {
    console.log(e);
    toastr.error("Something happened", "ERROR", {
      closeButton: true,
      positionClass: "toast-bottom-right",
    });
  }
}
