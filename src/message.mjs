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
                    font-size: var(--x-text-sm);

                    div {
	                    margin: 0 auto;
						max-width: var(--x-container-width);
						padding: var(--x-spacing-6);
	                    display: flex;
	                    justify-content: space-between;
						p { margin: auto 0; }
                    	button {
                     		background-color: hsla(0, 0%, 100%, 0.5);
                     		cursor: pointer;
                       		border: none;
                         	border-radius: var(--x-boder-radius);
                            padding: var(--x-spacing-2) var(--x-spacing-4);
                            margin: auto 0;
                       }
                    }
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
			case "info":
				return "hsl(var(--x-blue-1))";

			case "success":
				return "hsl(var(--x-green-1))";

			case "error":
				return "hsl(var(--x-red-1))";

			default:
				return "hsl(var(--x-gray-2))";
		}
	}

	#boxContent() {
		return `
            <div id="x-message">
            	<div class="container">
		             <p data-text>${this.#text}</p>
		             <button data-close>x</button>
             	</div>
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
