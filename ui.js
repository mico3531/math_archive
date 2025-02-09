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
        li.classList.add("list-group-item");

        const a = document.createElement("a");
        a.href = pdf.url;
        a.textContent = pdf.name;

        const commitInfo = document.createElement("div");
        commitInfo.classList.add("commit-info");
        commitInfo.textContent = `📅 更新日: ${pdf.commitDate.toLocaleString()} | ✍ ${pdf.commitMessage}`;

        li.appendChild(a);
        li.appendChild(commitInfo);
        listContainer.appendChild(li);
    });
}
