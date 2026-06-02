// @ts-check

import { CustomElement } from "./customElement.mjs";

class Modal extends CustomElement {
	/** @type {boolean} */
	open = false;

	/** @type {string} */
	width = "40rem";

	/** @type {string | null} */
	height = null;

	/** @type {string} */
	heading = "";

	#styles() {
		return `
			<style>
	            .x-modal {
	                color: hsl(var(--x-font-color));
	                position: absolute;
	                top: 0;
	                left: 0;
	                z-index: var(--x-layer-3);
	                width: 100vw;
	                height: 100vh;
	                background: hsla(var(--x-gray-7), 40%);
	                display: flex;

	                .window-container {
	                    margin: auto;
	                    padding: var(--x-space-6);
	                    width: ${this.width};

			           .window {
			               background-color: white;
			               border-radius: var(--x-border-radius);
			               height: ${this.height ? this.height : "auto"};
			               box-shadow: var(--x-shadow-sm);
			               border: var(--x-border-size-1) solid hsl(var(--x-gray-4));

			               .modal-header {
			                   padding: var(--x-space-6);
			                   display: flex;
			                   justify-content: space-between;
			                   font-family: var(--x-font);

			                   h2 {
			                       font-size: var(--x-text-lg);
			                       font-weight: normal;
			                       margin: 0;
			                   }

			                   .close {
			                       cursor: pointer;
			                   }
			               }

			               .modal-footer {
			                   background-color: hsla(var(--x-gray-2), 50%);
			                   padding: var(--x-space-8) var(--x-space-6);
			               }
			           }
                    }
                }
            </style>
		`;
	}

	constructor() {
		super();
		const open = this.getAttribute("open");
		if (open && open == "true") {
			this.open = true;
		}

		const width = this.getAttribute("width");
		if (width != null) {
			this.width = width;
		}

		const height = this.getAttribute("height");
		if (height != null) {
			this.height = height;
		}

		const heading = this.getAttribute("heading");
		if (!heading) {
			throw new Error("heading property is missing");
		}
		this.heading = heading;

		this.$add(this.#styles());
		if (this.open) {
			this.$add(this.#modalContent());
		}
	}

	#modalContent() {
		return `
            <div class="x-modal">
            	<div class="window-container">
	                <div class="window">
	                    <div class="modal-header">
	                        <h2>${this.heading}</h2>
	                        <button id="close" class="close">x</button>
	                    </div>
	                    <slot></slot>

	                    <div class="modal-footer">
	                        <slot id="footer-slot" name="footer"></slot>
	                    </div>
	                </div>
                </div>
            </div>
        `;
	}

	setOpen() {
		this.$add(this.#modalContent());
		this.$("#close").addEventListener("click", this.handleClose);
		this.open = true;
		this.$emit("open");
	}

	handleClose = () => {
		this.$(".x-modal").remove();
		this.open = false;
		this.$emit("close");
	};
}

customElements.define("x-modal", Modal);
