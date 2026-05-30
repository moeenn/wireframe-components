// @ts-check
import { CustomElement } from "./customElement.mjs";

class Loader extends CustomElement {
	#size = "1rem";

	/** @type {string | null} */
	#text = null;

	static get observedAttributes() {
		return ["text"];
	}

	/**
	 * @param {string} attribute
	 * @param {string} oldValue
	 * @param {string} newValue
	 */
	attributeChangedCallback(attribute, oldValue, newValue) {
		if (oldValue == newValue) return;
		switch (attribute) {
			case "text":
				this.#updateText(newValue);
				break;
		}
	}

	#styles() {
		return `
		<style>
			.x-loader {
				display: inline-flex;

				.spinner {
					margin: auto 0;
					display: inline-flex;
					width: ${this.#size};
					height: ${this.#size};
					border: 2px solid hsl(var(--x-gray-5));
					border-top-color: hsl(var(--x-font-color));
					border-bottom-color: hsl(var(--x-font-color));
					border-radius: 100%;
					animation: spin 0.5s linear infinite;
				}
				.text {
					margin: auto 0 auto 0.5rem;
					vertical-align: text-bottom;
					color: hsl(var(--x-font-color));
					font-family: var(--x-font);
				}
			}

			@keyframes spin {
				to {
					transform: rotate(360deg);
				}
			}
		</style>
		`;
	}

	constructor() {
		super();
		const size = this.getAttribute("size");
		if (size) {
			this.#size = size;
		}

		const text = this.getAttribute("text");
		if (text) {
			this.#text = text;
		}

		this.$add(`
			${this.#styles()}
			<div class="x-loader">
				<span class="spinner"></span>
				<span data-text class="text">${this.#text ?? ""}</span>
			</div>
		`);
	}

	/**
	 * @param {string} text
	 */
	#updateText(text) {
		this.$("[data-text]").innerHTML = text;
		this.#text = text;
	}
}

customElements.define("x-loader", Loader);
