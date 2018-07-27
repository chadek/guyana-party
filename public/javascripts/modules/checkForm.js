import { axiosGet } from "./utils";

function showErrorLabel(errorLabel, btn, msg) {
  errorLabel.classList.remove("hidden");
  errorLabel.innerHTML = msg;
  btn.disabled = true;
}

function checkName(inputs, nameInput, errorLabel, btn) {
  if (!inputs || !nameInput || !errorLabel || !btn) return;
  inputs.map(input => {
    return input.on("focusout", () => {
      errorLabel.innerHTML = "";
      errorLabel.classList.add("hidden");
      btn.disabled = false;
      const inputValue = nameInput.value;
      if (inputValue) {
        if (inputValue.length < 5) {
          showErrorLabel(
            errorLabel,
            btn,
            `Le nom doit comporter au moins 5 caractères.`
          );
          return;
        }
        if (inputValue.length > 50) {
          showErrorLabel(
            errorLabel,
            btn,
            `Le nom doit comporter au maximum 50 caractères.`
          );
          return;
        }
        axiosGet(`/api/isNameAvailable/${inputValue}`, data => {
          if (data) {
            if (!data.isNameAvailable) {
              showErrorLabel(
                errorLabel,
                btn,
                `"${inputValue}" n'est pas disponible.`
              );
            }
          }
        });
      }
    });
  });
}

export { checkName };
