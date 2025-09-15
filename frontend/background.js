// Add context menu for right-click save
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveResource",
    title: "Save this page to Student Buddy",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveResource") {
    let resource = { url: tab.url, note: "" };
    chrome.storage.local.get(["resources"], (result) => {
      let resources = result.resources || [];
      resources.push(resource);
      chrome.storage.local.set({ resources });
    });
  }
});
