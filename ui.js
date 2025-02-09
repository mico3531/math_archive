function setupUI(pdfList) {
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    // 修正: inputイベントを "keyup" ではなく "input" に変更
    searchInput.addEventListener("input", () => updateList(pdfList));

    // 修正: changeイベントで updateList を呼ぶ
    sortSelect.addEventListener("change", () => updateList(pdfList));
}

function updateList(pdfList) {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;
    const listContainer = document.getElementById("pdf-list");

    let filteredList = pdfList.filter(pdf => pdf.name.toLowerCase().includes(searchQuery));

    if (sortType === "name") {
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "date") {
        filteredList.sort((a, b) => b.commitDate - a.commitDate);
    }

    listContainer.innerHTML = "";
    filteredList.forEach(pdf => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = pdf.url;
        a.textContent = pdf.name;

        const commitInfo = document.createElement("span");
        commitInfo.classList.add("commit-info");
        commitInfo.textContent = `📅 更新日: ${pdf.commitDate.toLocaleString()} | ✍ ${pdf.commitMessage}`;

        li.appendChild(a);
        li.appendChild(commitInfo);
        listContainer.appendChild(li);
    });
}
