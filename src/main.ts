import { convertAsm, handleAsmFile } from "./asm";
import "./style.css";
import { convertWasm, handleWasmFile } from "./wasm";

handleAsmFile();

const buttonConvertAsm = document.getElementById("button-convert-asm");
buttonConvertAsm?.addEventListener("click", convertAsm);

handleWasmFile();

const buttonConvertWasm = document.getElementById("button-convert-wasm");
buttonConvertWasm?.addEventListener("click", convertWasm);
