import { AUTHORIZATION_INPUT_FIELDS } from "../../config";

export function handleFormError(error, other_code = null) {
    let error_message = null;
    let error_code = null;
    if(error) {
        error_message = error.message;
        error_code = error.code;
    }
    else {
        error_code = other_code;
    }
    const error_handler = {
        0: () => highlightFormElements(AUTHORIZATION_INPUT_FIELDS[0].ID, error_message),
        1: () => highlightFormElements(AUTHORIZATION_INPUT_FIELDS[0].ID, error_message),
        2: () => highlightFormElements(AUTHORIZATION_INPUT_FIELDS[1].ID, error_message),
        3: () => highlightFormElements(AUTHORIZATION_INPUT_FIELDS[2].ID, "Паролі не збігаються"),

    }

    if (error_handler[error_code]) {
        error_handler[error_code]();
    } else {
        alert(error_message || "Невідома помилка");
    }
}

function highlightFormElements(id, error_message) {
    const error_span = document.querySelector(`#${id}_error`);
    const input_field = document.querySelector(`#${id}`);
    if(error_span) {
        error_span.innerText = error_message;
        error_span.classList.remove("hidden");
    }
    if(input_field) {
        input_field.classList.remove("border-gray-300");
        input_field.classList.add("border-red-600");
    }
}

export function clearFormErrors(authorization_form) {
    const error_spans = authorization_form.querySelectorAll(`span`);
    const input_fields = authorization_form.querySelectorAll(`input`);
    if(error_spans) {
        error_spans.forEach(span => {
            span.innerText = "";
            span.classList.add("hidden");
        });
        
    }
    if(input_fields) {
        input_fields.forEach(input => {
            input.classList.remove("border-red-600");
            input.classList.add("border-gray-300");
        });
        
    }
}