function setupUI(pdfList) {
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    searchInput.addEventListener("input", () => updateList(pdfList));
    sortSelect.addEventListener("change", () => updateList(pdfList));
}

function updateList(pdfList) {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;
    const listContainer = document.getElementById("pdf-list");

    // フィルタリング（検索機能）
    let filteredList = pdfList.filter(pdf => pdf.name.toLowerCase().includes(searchQuery));

    // ソート（名前順 or 更新時刻順）
    if (sortType === "name") {
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "date") {
        filteredList.sort((a, b) => b.commitDate - a.commitDate);
    }

    // リストの更新
    listContainer.innerHTML = "";
    filteredList.forEach(pdf => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = pdf.url;
        a.textContent = pdf.name;

        const commitInfo = document.createElement("div");
        commitInfo.classList.add("commit-info");
        commitInfo.textContent = `更新日: ${pdf.commitDate.toLocaleString()} | メッセージ: ${pdf.commitMessage}`;

        li.appendChild(a);
        li.appendChild(commitInfo);
        listContainer.appendChild(li);
    });
}
