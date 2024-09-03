// eslint-disable-next-line no-undef
chrome.action.onClicked.addListener((tab) => {
  // eslint-disable-next-line no-undef
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Đây là mã được thực thi trong ngữ cảnh của trang
      const script = document.createElement("script");
      // eslint-disable-next-line no-undef
      script.src = chrome.runtime.getURL("contentScript.js");
      document.head.appendChild(script);
    },
  });
});
