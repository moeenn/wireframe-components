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
					border-bottom: 2px solid hsl(var(--x-gray-3));
					button#tab {
						padding: 0.5rem 0.8rem;
						color: hsl(var(--x-font-color));
						border: none;
						background: none;
						border-radius: var(--x-border-radius) var(--x-border-radius) 0 0;
						border-bottom: 2px solid transparent;
						margin-bottom: -2px;
						border-bottom: 2px solid hsl(var(--x-gray-3));

						&.selected {
							border-bottom: 2px solid black;
						}

						&:hover {
							background: hsl(var(--x-gray-1));
						}
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

/*
<x-tabs
	tabs='[{ "id": "one", "title": "Tab One" },{ "id": "two", "title": "Tab Two" },{ "id": "three", "title": "Tab Three" }]'
	selected="two"
></x-tabs>

<script>
	document.addEventListener("DOMContentLoaded", () => {
		const t = document.querySelector("x-tabs");
		t.addEventListener("change", (e) => {
			console.log("tab changed ->", e.detail.selected);
		});
	});
</script>
*/
