// Hàm xử lý khi di chuyển chuột
const handleMouseMove = (event) => {
  const { clientX, clientY } = event;
  console.log(`Mouse Position - X: ${clientX}, Y: ${clientY}`);
};

// Hàm xử lý khi bôi đen văn bản
const handleMouseUp = () => {
  setTimeout(async () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      console.log(`Selected Text: ${selectedText}`);

      // Dịch văn bản
      const translatedText = await translateText(selectedText, "en", "vi");

      // Hiển thị văn bản dịch trong hộp thoại
      showDialog(translatedText);
    } else {
      console.log("No text selected.");
    }
  }, 1000); // Delay 100ms để đảm bảo văn bản đã được chọn
};

// Hàm dịch văn bản
async function translateText(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data[0][0][0]; // Trả về bản dịch
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation failed";
  }
}

// Hàm hiển thị dialog với nội dung dịch
const showDialog = (text) => {
  let dialog = document.getElementById("translationDialog");
  if (!dialog) {
    dialog = document.createElement("div");
    dialog.id = "translationDialog";
    dialog.style.position = "fixed";
    dialog.style.left = "50%";
    dialog.style.top = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    dialog.style.color = "white";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "8px";
    dialog.style.zIndex = "1000";
    dialog.style.width = "300px";
    dialog.style.textAlign = "center";
    dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";

    const textElement = document.createElement("p");
    textElement.innerText = text;
    dialog.appendChild(textElement);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.addEventListener("click", () => {
      hideDialog();
    });
    dialog.appendChild(closeButton);

    document.body.appendChild(dialog);
  } else {
    dialog.querySelector("p").innerText = text;
    dialog.style.display = "block";
  }
};

// Hàm ẩn dialog
const hideDialog = () => {
  const dialog = document.getElementById("translationDialog");
  if (dialog) {
    dialog.style.display = "none";
  }
};

// Gắn sự kiện di chuyển chuột và thả chuột
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseup", handleMouseUp);

// Xóa sự kiện khi content script bị gỡ bỏ
const cleanUp = () => {
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  hideDialog(); // Ẩn dialog khi không cần thiết nữa
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cleanUp();
  }
});
