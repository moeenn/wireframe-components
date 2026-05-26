// @ts-check
export class CustomElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	/**
	 * @param {string} selector
	 * @returns {Element}
	 */
	$(selector) {
		const target = this.shadowRoot;
		if (!target) {
			throw new Error("shadowRoot not initialized");
		}

		const e = target.querySelector(selector);
		if (!e) {
			throw new Error(`element not found: ${selector}`);
		}
		return e;
	}

	/**
	 * @param {string} selector
	 * @returns {Element[]}
	 */
	$s(selector) {
		const target = this.shadowRoot;
		if (!target) {
			throw new Error("shadowRoot not initialized");
		}

		const e = target.querySelectorAll(selector);
		return [...e];
	}

	/**
	 * @param {string} selector
	 * @returns {Element | null}
	 */
	$optional(selector) {
		const target = this.shadowRoot;
		if (!target) {
			throw new Error("shadowRoot not initialized");
		}
		return target.querySelector(selector);
	}

	/**
	 * @param {string} content
	 */
	$add(content) {
		const target = this.shadowRoot;
		if (!target) {
			throw new Error("shadowRoot not initialized");
		}
		target.innerHTML += content;
	}

	/**
	 * @param {string} name
	 * @param {object} [detail]
	 */
	$emit(name, detail) {
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}
}
