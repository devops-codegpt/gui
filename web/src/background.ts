export default chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: 'index.html',
    type: 'popup',
    width: 1200,
    height: 800,
  })
})

