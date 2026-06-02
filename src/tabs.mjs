import { CustomElement } from "./customElement.mjs";

/**
 * @typedef Tab
 * @property {string} id
 * @property {string} title
 */

export class Tabs extends CustomElement {
	/** @type {Tab[]} */
	#tabs = [];

	/** @type {string} */
	#selected;

	static get observedAttributes() {
		return ["selected"];
	}

	/**
	 * @param {string} attribute
	 * @param {string} oldValue
	 * @param {string} newValue
	 */
	attributeChangedCallback(attribute, oldValue, newValue) {
		if (oldValue == newValue) return;
		switch (attribute) {
			case "selected":
				this.#setTab(newValue);
				break;
		}
	}

	#styles() {
		return `
			<style>
				#x-tabs {
					border-bottom: var(--x-border-size-2) solid hsl(var(--x-gray-3));
					button#tab {
						padding: var(--x-space-4) var(--x-space-5);
						color: hsl(var(--x-font-color));
						border: none;
						background: none;
						border-radius: var(--x-border-radius) var(--x-border-radius) 0 0;
						border-bottom: var(--x-border-size-2) solid transparent;
						margin-bottom: calc(var(--x-border-size-2) * -1);
						border-bottom: var(--x-border-size-2) solid hsl(var(--x-gray-3));
						cursor: pointer;

						&.selected { border-bottom: 2px solid hsl(var(--x-primary-1)); }
						&:hover { background: hsl(var(--x-gray-2)); }
					}
				}
			</style>
		`;
	}

	constructor() {
		super();

		const tabs = this.getAttribute("tabs");
		if (tabs) {
			this.#tabs = JSON.parse(tabs);
		}

		const sel = this.getAttribute("selected");
		if (sel) {
			this.#selected = sel;
		}

		this.$add(`
			${this.#styles()}
			<div id="x-tabs">
				${this.#tabs.map((t) => `<button data-tab="${t.id}" id="tab" class="${t.id == this.#selected ? "selected" : ""}">${t.title}</button>`).join("")}
			</div>
		`);
	}

	/** @param {string} tabId */
	#setTab(tabId) {
		if (tabId == this.#selected) return;
		const tabs = this.$s("[data-tab]");
		for (const t of tabs) {
			if (tabId == t.dataset["tab"]) {
				if (!t.classList.contains("selected")) {
					t.classList.add("selected");
				}
			} else {
				t.classList.remove("selected");
			}
		}

		this.$emit("change", { selected: this.#selected });
		this.#selected = tabId;
	}

	connectedCallback() {
		const tabs = this.$s("[data-tab]");
		for (const t of tabs) {
			t.addEventListener("click", () => this.#setTab(t.dataset["tab"]));
		}
	}
}

customElements.define("x-tabs", Tabs);
