document.addEventListener("DOMContentLoaded", async function() {
    const username = "mico3531";  // GitHubユーザー名
    const repo = "math_archive";  // リポジトリ名
    const folder = "docs";  // PDFがあるフォルダ
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;
    
    const pdfList = [];  // PDF情報を格納する配列

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("GitHub APIのレスポンスエラー");

        const files = await response.json();
        const pdfFiles = files.filter(file => file.name.endsWith(".pdf"));

        for (const file of pdfFiles) {
            const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?path=${folder}/${file.name}&per_page=1`;
            const commitResponse = await fetch(commitUrl);
            const commits = await commitResponse.json();

            let commitMessage = "コミット情報なし";
            let commitDate = new Date(0); // 初期値として古い日付

            if (commits.length > 0) {
                commitMessage = commits[0].commit.message.split("Signed-off-by:")[0].trim();
                commitDate = new Date(commits[0].commit.author.date);
            }

            pdfList.push({
                name: file.name,
                url: `docs/${file.name}`,
                commitMessage,
                commitDate
            });
        }

        updateList(); // 初回リスト更新
    } catch (error) {
        console.error("GitHub APIの取得エラー:", error);
        document.getElementById("pdf-list").innerHTML = "<p>PDFの一覧を取得できませんでした。</p>";
    }

    // UI.js にあるソート・検索機能を設定
    setupUI(pdfList);
});
