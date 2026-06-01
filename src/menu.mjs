// @ts-check

import { CustomElement } from "./customElement.mjs";

class Menu extends CustomElement {
	#open = false;
	#position = "right";
	#width = "20rem";

	static get observedAttributes() {
		return ["open"];
	}

	/**
	 * @param {string} attribute
	 * @param {string} oldValue
	 * @param {string} newValue
	 */
	attributeChangedCallback(attribute, oldValue, newValue) {
		switch (attribute) {
			case "open":
				this.#setOpen(newValue);
				break;
		}
	}

	#styles() {
		return `
			<style>
				.x-menu {
					position: relative;
					display: inline-block;

					.content {
						position: absolute;
						border: var(--x-border-size-1) solid hsl(var(--x-gray-3));
						background: white;
						width: ${this.#width};
						border-radius: var(--x-border-radius);
						box-shadow: var(--x-shadow-sm);
						margin-top: var(--x-spacing-4);
						z-index: var(--x-layer-3);
						${this.#getPositionStyles()}

						&.hidden {
							display: none;
						}
					}
				}
			</style>
		`;
	}

	#getPositionStyles() {
		switch (this.#position) {
			case "right":
				return "";

			case "left":
				return "right: 0;";

			case "top-right":
				return "bottom: calc(100% + var(--x-spacing-4));";

			case "top-left":
				return "right: 0; bottom: calc(100% + var(--x-spacing-4));";

			default:
				throw new Error("invalid position value: " + this.#position);
		}
	}

	constructor() {
		super();
		const position = this.getAttribute("position");
		if (position) {
			this.#position = position;
		}

		const width = this.getAttribute("width");
		if (width) {
			this.#width = width;
		}

		this.$add(`
			${this.#styles()}
			<div class="x-menu">
				<slot name="trigger"></slot>
				<div class="content ${this.#open ? "" : "hidden"}">
					<slot name="items"></slot>
				</div>
			</div>
		`);
	}

	#toggleMenu = () => {
		this.$(".content").classList.toggle("hidden");
		this.#open = !this.#open;
	};

	/** @param {string} value */
	#setOpen = (value) => {
		const open = value == "" || value == "true";
		if (open) {
			this.$(".content").classList.remove("hidden");
		} else {
			this.$(".content").classList.add("hidden");
		}

		this.#open = open;
	};

	/** @param {PointerEvent} e */
	#handleOutsideClick = (e) => {
		if (e.target && !this.contains(/** @type {Node} */ (e.target))) {
			this.#setOpen("false");
		}
	};

	connectedCallback() {
		this.$("[name='trigger']").addEventListener("click", this.#toggleMenu);
		document.addEventListener("click", this.#handleOutsideClick);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.#handleOutsideClick);
	}
}

customElements.define("x-menu", Menu);
