import { convertAsm, handleAsmFile } from "./asm";
import { convertAsmWW, handleAsmWWFile } from "./asm-ww";
import "./style.css";
import { convertWasm, handleWasmFile } from "./wasm";
import { convertWasmMt, handleWasmMtFile } from "./wasm-mt";

handleAsmFile();

const buttonConvertAsm = document.getElementById("button-convert-asm");
buttonConvertAsm?.addEventListener("click", convertAsm);

handleAsmWWFile();

const buttonConvertAsmWW = document.getElementById("button-convert-asm-ww");
buttonConvertAsmWW?.addEventListener("click", convertAsmWW);

handleWasmFile();

const buttonConvertWasm = document.getElementById("button-convert-wasm");
buttonConvertWasm?.addEventListener("click", convertWasm);

handleWasmMtFile();

const buttonConvertWasmMt = document.getElementById("button-convert-wasm-mt");
buttonConvertWasmMt?.addEventListener("click", convertWasmMt);

export const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
			});
			if (registration.installing) {
				console.log("Service worker installing");
			} else if (registration.waiting) {
				console.log("Service worker installed");
			} else if (registration.active) {
				console.log("Service worker active");
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};

registerServiceWorker();
