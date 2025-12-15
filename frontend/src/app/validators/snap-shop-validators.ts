import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class SnapShopValidators {

    // whitespace validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors {

        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object
            return { 'notOnlyWhiteSpace': true };
        } else {
            // valid, return null
            return null;
        }
    }

    static luhnCheck(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null; // nic nie sprawdzamy, puste pole obsłuży inny walidator (np. required)
    }

    const trimmed = value.replace(/\D/g, ''); // usuń wszystkie znaki niebędące cyframi
    let sum = 0;
    let shouldDouble = false;

    for (let i = trimmed.length - 1; i >= 0; i--) {
      let digit = parseInt(trimmed.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const isValid = sum % 10 === 0;
    return isValid ? null : { luhnCheck: true };
  }
}
