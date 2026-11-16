chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  // Clear first so reloading or updating the extension doesn't hit a "duplicate id" error.
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "decode-dream-symbol",
      title: "Interpret \"%s\" in Midnight Dream Catcher",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decode-dream-symbol" && info.selectionText) {
    chrome.storage.local.set({
      pendingSymbol: info.selectionText.trim().slice(0, 500),
      // info.pageUrl is given to every context-menu click. tab.url is empty
      // without the "tabs" permission, which this extension deliberately doesn't request.
      sourceUrl: info.pageUrl || tab?.url || "",
      capturedAt: Date.now()
    });
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});
