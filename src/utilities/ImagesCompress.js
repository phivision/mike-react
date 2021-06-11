let newImage;

// transfer base64 to image/file
const base64ToBlob = (urlData, type) => {
  let arr = urlData.split(",");
  let mime = arr[0].match(/:(.*?);/)[1] || type;
  let bytes = window.atob(arr[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mime,
  });
};

const canvasCut = async (path, file, imageWidth) => {
  return new Promise(function (resolve, reject) {
    let img = new Image();
    img.onload = function () {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let originWidth = img.width;
      let originHeight = img.height;
      canvas.width = imageWidth;
      canvas.height = (originHeight * canvas.width) / originWidth;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL(file.type);
      newImage = base64ToBlob(dataUrl, file.type);
      resolve(newImage);
    };
    img.onerror = function () {
      reject(new Error("Could not load image at " + path));
    };
    img.src = path;
  });
};

//pass image and image width. Reduce the size of the image by reducing it to the specified width
const beforeImageUpload = async (file, imageWidth) => {
  return new Promise(function (resolve, reject) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      alert("Upload picture format can only be JPG and PNG format");
    }
    if (!isLt2M) {
      alert("Upload image size must not exceed 2MB" + file.size);
    }
    let imageReader = new FileReader();
    imageReader.onload = async function (e) {
      let re = e.target.result;
      resolve(await canvasCut(re, file, imageWidth));
    };
    imageReader.onerror = function () {
      reject(new Error("Could not load imageReader"));
    };
    imageReader.readAsDataURL(file);
  });
};

export { beforeImageUpload, canvasCut, base64ToBlob };
