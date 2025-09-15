// Load resources when popup opens
document.addEventListener("DOMContentLoaded", () => {
  loadResources();
});

document.getElementById("searchBtn").addEventListener("click", () => {
  let query = document.getElementById("searchBox").value;
  if (query) {
    chrome.tabs.create({ url: "https://www.google.com/search?q=" + encodeURIComponent(query) });
  }
});

document.getElementById("saveBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    let note = document.getElementById("noteBox").value;
    let resource = { url, note };

    chrome.storage.local.get(["resources"], (result) => {
      let resources = result.resources || [];
      resources.push(resource);
      chrome.storage.local.set({ resources }, () => {
        loadResources();
        document.getElementById("noteBox").value = "";
      });
    });
  });
});

document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.storage.local.get(["resources"], (result) => {
    let resources = result.resources || [];
    let text = resources.map(r => `${r.url} - ${r.note || ""}`).join("\n");
    let blob = new Blob([text], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: "assignment_resources.txt"
    });
  });
});

function loadResources() {
  chrome.storage.local.get(["resources"], (result) => {
    let resources = result.resources || [];
    let list = document.getElementById("resourcesList");
    list.innerHTML = "";

    resources.forEach((r, index) => {
      let li = document.createElement("li");
      li.innerHTML = `<a href="${r.url}" target="_blank">${r.url}</a><br><small>${r.note || ""}</small>`;
      
      let delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.style.float = "right";
      delBtn.addEventListener("click", () => {
        resources.splice(index, 1);
        chrome.storage.local.set({ resources }, loadResources);
      });

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  });
}

document.getElementById("uploadPdfBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfInput");
  if (!fileInput.files.length) return alert("Please select a PDF file");

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", "My Assignment"); // optional
  formData.append("studentName", "Student Name"); // optional

  try {
    const res = await fetch("http://localhost:8002/upload/file", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    // ✅ Read response as a Blob (PDF)
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Well_Documented_Assignment.pdf";
    a.click();
    URL.revokeObjectURL(url);

    alert("PDF uploaded and downloaded!");
  } catch (err) {
    console.error(err);
    alert("Failed to upload PDF");
  }
});
