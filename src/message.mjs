// @ts-check
import { CustomElement } from "./customElement.mjs";

class Message extends CustomElement {
	/** @type {boolean} */
	#open = true;
	#text = "";
	#type = "info";

	static get observedAttributes() {
		return ["text", "type", "show"];
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

			case "show":
				this.#updateShow(newValue);
				break;
		}
	}

	#styles() {
		return `
			<style>
                #x-message {
                    background-color: ${this.#getBoxColor()};
                    padding: 1rem;
                    font-size: var(--x-text-sm);
                    display: flex;
                    justify-content: space-between;

                    p { margin: auto 0; }
                    button { cursor: pointer; }
                }
            </style>
		`;
	}

	constructor() {
		super();
		const text = this.getAttribute("text");
		if (text) {
			this.#text = text;
		}

		const show = this.getAttribute("show");
		if (show || show == "false") {
			this.#open = false;
		}

		const type = this.getAttribute("type");
		if (type) {
			this.#type = type;
		}

		this.$add(this.#styles());
		if (this.#open) {
			this.$add(this.#boxContent());
		}
	}

	#getBoxColor() {
		switch (this.#type) {
			case "success":
				return "hsla(var(--x-blue-1), 100%)";

			case "error":
				return "hsla(var(--x-red-1), 100%)";

			default:
				return "hsla(var(--x-gray-1), 100%)";
		}
	}

	#boxContent() {
		return `
            <div id="x-message">
                <p data-text>${this.#text}</p>
                <button data-close>x</>
            </div>
        `;
	}

	show = () => {
		if (this.#open) return;
		this.$add(this.#boxContent());
		this.connectedCallback();
		this.#open = true;
	};

	dismiss = () => {
		if (!this.#open) return;
		this.$("#x-message").remove();
		this.#open = false;
	};

	/**
	 * @param {string} text
	 */
	#updateText(text) {
		this.$("[data-text]").innerHTML = text;
		this.#text = text;
	}

	/**
	 * @param {string} value
	 */
	#updateShow(value) {
		if (value && value == "true") {
			if (this.#open) return;
			this.show();
		}

		if (!value || value == "false") {
			if (!this.#open) return;
			this.dismiss();
		}
	}

	connectedCallback() {
		const el = this.$optional("[data-close]");
		if (el) {
			el.addEventListener("click", this.dismiss);
		}
	}
}

customElements.define("x-message", Message);

/*

<x-message text="This is a simple message box." type="error"></x-message>

<div style="padding: 2rem;">
	<button id="open">Open</button>
	<button id="close">Close</button>
</div>

<script>
	document.addEventListener("DOMContentLoaded", () => {
		const msg = document.querySelector("x-message")
		const btn = document.querySelector("#open")
		const btnClose = document.querySelector("#close")

		btn.addEventListener("click", () => {
			msg.show()
		})

		btnClose.addEventListener("click", () => {
			msg.dismiss()
		})
	})
</script>
*/
