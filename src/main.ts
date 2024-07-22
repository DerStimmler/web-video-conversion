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
