import { CustomElement } from "./customElement.mjs";

/**
 * @typedef Entry
 * @property {string} id
 * @property {string} text
 * @property {string} [href]
 */

class BreadCrumbs extends CustomElement {
	/** @type {Entry[]} */
	#entries = [];

	#styles() {
		return `
			<style>
				.x-breadcrumbs {
					display: inline-flex;

					.entry {
						padding: var(--x-spacing-2) var(--x-spacing-3);
						font-size: var(--x-text-sm);
						color: var(--x-font-color);
						margin: auto 0;
						text-decoration: none;

						&:hover:not(span) {
							background-color: hsl(var(--x-gray-1));
							border-radius: var(--x-border-radius);
						}
					}

					svg {
						padding: auto var(--x-spacing-3);
						color: var(--x-font-color);
						height: 1rem;
						margin: auto var(--x-spacing-3);
					}
				}
			</style>
		`;
	}

	constructor() {
		super();
		const entries = this.getAttribute("entries");
		if (!entries) {
			throw new Error("entries attribute is missing");
		}
		this.#entries = JSON.parse(entries);

		this.$add(`
			${this.#styles()}
			<div class="x-breadcrumbs">
				${this.#renderEntries()}
			</div>
		`);
	}

	#separator() {
		return `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="sep">
			  <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
			</svg>
		`;
	}

	#renderEntries() {
		const content = this.#entries.map((e) => {
			if (e.href) {
				return `<a href='${e.href}' data-id='${e.id}' class='entry' alt='link'>${e.text}</a>`;
			}
			return `<span data-id='${e.id}' alt='link' class='entry'>${e.text}</span>`;
		});

		return content.join(this.#separator());
	}
}

customElements.define("x-breadcrumbs", BreadCrumbs);
