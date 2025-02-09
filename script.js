document.addEventListener("DOMContentLoaded", async function () {
    const username = "mico3531";
    const repo = "math_archive";
    const branch = "main";
    const folder = "docs";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;

    const listContainer = document.getElementById("pdf-list");

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`GitHub APIエラー: ${response.status}`);

        const files = await response.json();
        
        // レスポンスが配列でない場合の処理
        if (!Array.isArray(files)) throw new Error("レスポンスが想定と異なります");

        const pdfFiles = files.filter(file => file.name.endsWith(".pdf"));

        if (pdfFiles.length === 0) {
            listContainer.innerHTML = "<p>公開中のPDFはありません。</p>";
        } else {
            listContainer.innerHTML = ""; // 一度クリア

            for (const file of pdfFiles) {
                try {
                    const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?path=${folder}/${file.name}&per_page=1`;
                    const commitResponse = await fetch(commitUrl);
                    if (!commitResponse.ok) throw new Error("コミット情報の取得に失敗");

                    const commits = await commitResponse.json();
                    
                    let commitMessage = "コミット情報なし";
                    let commitDate = "";

                    if (Array.isArray(commits) && commits.length > 0) {
                        commitMessage = commits[0].commit.message.split("\n")[0]; // 1行目のみ取得
                        commitDate = new Date(commits[0].commit.author.date).toLocaleString();
                    }

                    // リストの要素を作成
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="docs/${file.name}">${file.name}</a> 
                                    <span class="commit-info">📅 更新日: ${commitDate} | ✍ ${commitMessage}</span>`;

                    listContainer.appendChild(li);
                } catch (commitError) {
                    console.error(`コミット情報取得エラー (${file.name}):`, commitError);
                }
            }
        }
    } catch (error) {
        console.error("GitHub APIの取得エラー:", error);
        listContainer.innerHTML = "<p>PDFの一覧を取得できませんでした。</p>";
    }
});
