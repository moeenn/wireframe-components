// @ts-check

import { CustomElement } from "./customElement.mjs";

class Avatar extends CustomElement {
	/** @type {string | null} */
	#src = null;
	#size = "5rem";

	#styles() {
		return `
			<style>
				.x-avatar {
					display: inline-flex;
					height: ${this.#size};
					width: ${this.#size};
					background: hsl(var(--x-gray-3));
					border-radius: 100%;

					.icon {
						margin: auto;
						height: calc(${this.#size} * 0.45);
						width: calc(${this.#size} * 0.45);
						color: hsl(var(--x-gray-7));
					}

					.picture {
						height: ${this.#size};
						width: ${this.#size};
						object-fit: cover;
						border-radius: 100%;
					}
				}
			</style>
		`;
	}

	constructor() {
		super();

		const src = this.getAttribute("src");
		if (src) {
			this.#src = src;
		}

		const size = this.getAttribute("size");
		if (size) {
			this.#size = size;
		}

		this.$add(`
			${this.#styles()}
			<div class="x-avatar">
				${this.#userIcon()}
			</div>
		`);
	}

	#userIcon() {
		if (!this.#src) {
			return `
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
			`;
		}

		return `
			<img src="${this.#src}" alt="user-avatar" class="picture" />
		`;
	}
}

customElements.define("x-avatar", Avatar);
