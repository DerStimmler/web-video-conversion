let file: File;

export function handleWasmFile() {
	const inputElement = document.getElementById("wasm-file-input");
	inputElement?.addEventListener(
		"change",
		(ev: any) => (file = ev.target.files[0] as File),
		false
	);
}

export function convertWasm() {
	if (!file) {
		alert("Please select a file first.");
		return;
	}

	const formatInput = document.getElementById(
		"wasm-format-input"
	) as HTMLSelectElement;
	const format = formatInput.options[formatInput.selectedIndex].text;
	const mimeType = formatInput.options[formatInput.selectedIndex].value;

	convertFile(file, format, mimeType);
}

function convertFile(file: File, format: string, mimeType: string) {}
