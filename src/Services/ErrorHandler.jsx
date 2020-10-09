import toastr from "toastr";

export default function ErrorHandler(error) {
  console.log(error);
  console.log(error.response);
  toastr.error(error.response.data.detail.msg || error.response.data.detail, "ERROR", {
    closeButton: true,
    positionClass: "toast-bottom-right",
  });
}
