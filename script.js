document.addEventListener("DOMContentLoaded", async function() {
    const username = "mico3531";  // GitHubユーザー名
    const repo = "math_archive";  // リポジトリ名
    const folder = "docs";  // PDFがあるフォルダ
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;
    const listContainer = document.getElementById("pdf-list");

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("GitHub APIのレスポンスエラー");

        const files = await response.json();
        const pdfFiles = files.filter(file => file.name.endsWith(".pdf"));

        if (pdfFiles.length === 0) {
            listContainer.innerHTML = "<p>公開中のPDFはありません。</p>";
        } else {
            for (const file of pdfFiles) {
                const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?path=${folder}/${file.name}&per_page=1`;
                const commitResponse = await fetch(commitUrl);
                const commits = await commitResponse.json();

                let commitMessage = "コミット情報なし";
                let commitDate = "";

                if (commits.length > 0) {
                    commitMessage = commits[0].commit.message.split("Signed-off-by:")[0].trim(); // "Signed-off-by:" 以降を削除
                    commitDate = new Date(commits[0].commit.author.date).toLocaleString();
                }

                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `docs/${file.name}`;
                a.textContent = file.name;

                const commitInfo = document.createElement("div");
                commitInfo.classList.add("commit-info");
                commitInfo.textContent = `更新日: ${commitDate} | メッセージ: ${commitMessage}`;

                li.appendChild(a);
                li.appendChild(commitInfo);
                listContainer.appendChild(li);
            }
        }
    } catch (error) {
        console.error("GitHub APIの取得エラー:", error);
        listContainer.innerHTML = "<p>PDFの一覧を取得できませんでした。</p>";
    }
});
