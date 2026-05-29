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
						background: hsl(var(--x-gray-1));
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
				return "bottom: 0;";

			case "top-left":
				return "right: 0; bottom: 0;";

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
		if (e.target && !this.contains(/** @type {Node} */(e.target))) {
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

/*
<body style="padding: 3rem">
	<x-menu width="40rem">
		<button slot="trigger" position="right">Open Menu</button>
		<div slot="items">
			<p class="menu-item">One</p>
			<p class="menu-item">Two</p>
			<p class="menu-item">Three</p>
			<p class="menu-item">Four</p>
			<p class="menu-item">Five</p>
		</div>
	</x-menu>

	<x-menu style="position: absolute; right: 2rem" position="left">
		<button slot="trigger">Open Menu</button>
		<div slot="items">
			<p class="menu-item">One</p>
			<p class="menu-item">Two</p>
			<p class="menu-item">Three</p>
			<p class="menu-item">Four</p>
			<p class="menu-item">Five</p>
		</div>
	</x-menu>

	<x-menu
		style="position: absolute; bottom: 2rem; left: 2rem"
		position="top-right"
	>
		<button slot="trigger">Open Menu</button>
		<div slot="items">
			<p class="menu-item">One</p>
			<p class="menu-item">Two</p>
			<p class="menu-item">Three</p>
			<p class="menu-item">Four</p>
			<p class="menu-item">Five</p>
		</div>
	</x-menu>

	<x-menu
		style="position: absolute; bottom: 2rem; right: 2rem"
		position="top-left"
	>
		<button slot="trigger">Open Menu</button>
		<div slot="items">
			<p class="menu-item">One</p>
			<p class="menu-item">Two</p>
			<p class="menu-item">Three</p>
			<p class="menu-item">Four</p>
			<p class="menu-item">Five</p>
		</div>
	</x-menu>

	<script>
		const menu = document.querySelector("x-menu");
		const items = document.querySelectorAll(".menu-item");
		items.forEach((item) =>
			item.addEventListener("click", (e) => {
				console.log("clicked ::", e.target.innerText);
				menu.setAttribute("open", "false");
			}),
		);
	</script>
</body>
*/
