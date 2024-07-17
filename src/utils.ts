export function downloadBlob(
	blobParts: BlobPart[],
	mimeType: string,
	outputFileName: string
) {
	const blob = new Blob(blobParts, { type: mimeType });
	const downloadUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = downloadUrl;
	link.download = outputFileName;
	link.click();
	URL.revokeObjectURL(downloadUrl);
}
