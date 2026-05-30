// @ts-check
import { CustomElement } from "./customElement.mjs";

class Checkbox extends CustomElement {
	#name = "";
	#label = "";
	#checked = false;

	static get observedAttributes() {
		return ["checked"];
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
				this.#setChecked(newValue);
				break;
		}
	}

	#styles() {
		return `
			<style>
				.x-checkbox {
					display: inline-flex;
					cursor: pointer;

					.box {
						display: inline-flex;
						width: var(--x-spacing-5);
						height: var(--x-spacing-5);
						background: hsl(var(--x-gray-3));
						border: 5px solid hsl(var(--x-gray-3));
						border-radius: var(--x-border-radius);

						&.checked {
							background: hsl(var(--x-primary-1));
						}
					}

					.label {
						font-family: var(--x-font);
						color: hsl(var(--x-font-color));
						margin: auto 0 auto var(--x-spacing-4);
					}

					.input { display: none; }
				}
			</style>
		`;
	}

	constructor() {
		super();
		const name = this.getAttribute("name");
		if (!name) {
			throw new Error("name attribute is required");
		}
		this.#name = name;

		const label = this.getAttribute("label");
		if (!label) {
			throw new Error("label attribute is required");
		}
		this.#label = label;

		const checked = this.getAttribute("checked");
		if (checked != null || checked == "true") {
			this.#checked = true;
		}

		this.$add(`
			${this.#styles()}
			<div class="x-checkbox">
				<span class="box ${this.#checked ? "checked" : ""}"></span>
				<span class="label">${this.#label}</span>
				<input type="checkbox" data-input class="input" checked="${this.#checked ? "checked" : ""}" />
			</div>
		`);
	}

	#toggleChecked = () => {
		this.$(".box").classList.toggle("checked");
		/** @type {HTMLInputElement} */ (this.$("[data-input]")).checked =
			!this.#checked;
		this.#checked = !this.#checked;
	};

	/** @param {string} v */
	#setChecked = (v) => {
		const newValue = v == "" || v == "true";

		const el = this.$(".box");
		if (newValue && !el.classList.contains("checked")) {
			el.classList.add("checked");
		}
		if (!newValue) {
			el.classList.remove("checked");
		}

		/** @type {HTMLInputElement} */ (this.$("[data-input]")).checked =
			newValue;
		this.#checked = newValue;
	};

	connectedCallback() {
		this.$(".x-checkbox").addEventListener("click", this.#toggleChecked);
	}
}

customElements.define("x-checkbox", Checkbox);
