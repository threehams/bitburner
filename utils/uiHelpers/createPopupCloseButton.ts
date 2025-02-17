/**
 * Creates a Close/Cancel button that is used for removing popups
 */

import { createElement } from "./createElement";
import { removeElement } from "./removeElement";

interface ICreatePopupCloseButtonOptions {
  class?: string;
  display?: string;
  innerText?: string;
  type?: string;
}

export function createPopupCloseButton(
  popup: Element | string,
  options: ICreatePopupCloseButtonOptions,
): HTMLButtonElement {
  const button = createElement("button", {
    class: options.class ? options.class : "popup-box-button",
    display: options.display ? options.display : "inline-block",
    innerText: options.innerText == null ? "Cancel" : options.innerText,
  }) as HTMLButtonElement;

  function closePopupWithEscFn(e: any): void {
    if (e.keyCode === 27) {
      button.click();
    }
  }

  button.addEventListener("click", () => {
    if (popup instanceof Element) {
      removeElement(popup);
    } else {
      try {
        const popupEl = document.getElementById(popup);
        if (popupEl instanceof Element) {
          removeElement(popupEl);
        }
      } catch (e) {
        console.error(`createPopupCloseButton() threw: ${e}`);
      }
    }

    document.removeEventListener("keydown", closePopupWithEscFn);
    return false;
  });

  document.addEventListener("keydown", closePopupWithEscFn);

  return button;
}
