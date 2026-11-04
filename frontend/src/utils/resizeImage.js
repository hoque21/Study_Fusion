export const resizeImage = (file, maxDimension = 240) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Please choose an image smaller than 5 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the selected image."));
        return;
      }
      const image = new Image();
      image.onerror = () => reject(new Error("The selected image could not be opened."));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(
          maxDimension / image.width,
          maxDimension / image.height,
          1,
        );
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image processing is unavailable in this browser."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
