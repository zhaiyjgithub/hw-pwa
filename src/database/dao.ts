export const SchemaImage = "igi_image"
export const SchemaVideo = "igi_video"

export const DBConfig = {
  name: "igi_db",
  version: 1,
  objectStoresMeta: [
    {
      store: SchemaImage,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "data", keypath: "data", options: { unique: false } },
        { name: "createdAt", keypath: "createdAt", options: { unique: false } },
        { name: "uploadStatus", keypath: "uploadStatus", options: { unique: false } },
      ],
    },
    {
      store: SchemaVideo,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "data", keypath: "data", options: { unique: false } },
        { name: "createdAt", keypath: "createdAt", options: { unique: false } },
        { name: "uploadStatus", keypath: "uploadStatus", options: { unique: false } },
      ],
    },
  ],
};

export function downloadVideo(recordedChunks: any[], name: string) {
  if (recordedChunks.length) {
    const blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none")
    a.href = url;
    a.download = `${name}-capture.webm` //"react-webcam-stream-capture.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
