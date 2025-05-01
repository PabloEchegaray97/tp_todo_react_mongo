import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

// Función para mostrar alertas usando SweetAlert2 con los temas de la aplicación
export const showAlert = (
  title: string,
  icon: SweetAlertIcon = "success",
  options?: SweetAlertOptions
) => {
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  return Swal.fire({
    title,
    icon,
    background: isDarkMode
      ? "var(--color-bg-secondary)"
      : "var(--color-bg-secondary)",
    color: isDarkMode
      ? "var(--color-text-primary)"
      : "var(--color-text-primary)",
    confirmButtonColor: isDarkMode
      ? "var(--color-button-primary)"
      : "var(--color-button-primary)",
    cancelButtonColor: isDarkMode
      ? "var(--color-border)"
      : "var(--color-border)",
    buttonsStyling: true,
    customClass: {
      confirmButton: "swal-confirm-button",
      cancelButton: "swal-cancel-button",
    },
    ...options,
  });
};

// Función para mostrar confirmaciones usando SweetAlert2
export const showConfirm = (
  title: string,
  text: string,
  confirmButtonText = "Aceptar",
  cancelButtonText = "Cancelara"
) => {
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  return Swal.fire({
    title,
    text,
    icon: "question",
    background: isDarkMode
      ? "var(--color-bg-secondary)"
      : "var(--color-bg-secondary)",
    color: isDarkMode
      ? "var(--color-text-primary)"
      : "var(--color-text-primary)",
    confirmButtonColor: isDarkMode
      ? "var(--color-button-primary)"
      : "var(--color-border)",
    cancelButtonColor: isDarkMode
      ? "var(--color-border)"
      : "var(--color-border)",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: true,
    customClass: {
      confirmButton: "swal-confirm-button",
      cancelButton: "swal-cancel-button",
    },
  });
};
