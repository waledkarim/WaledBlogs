export default function base64ToFile(base64String, fileName) {
    // Split the base64 string to get the mime type and the actual base64 data
    let arr = base64String.split(',');
    let mimeMatch = arr[0].match(/:(.*?);/);
    let mime = mimeMatch ? mimeMatch[1] : 'image/png'; // Default to PNG if mime type is unknown

    // Decode the base64 string
    let byteString = atob(arr[1]);

    // Create an array buffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let uint8Array = new Uint8Array(arrayBuffer);

    // Fill the array buffer with binary data
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob with the appropriate mime type
    let blob = new Blob([uint8Array], { type: mime });

    // Convert Blob to File
    return new File([blob], fileName, { type: mime });
}