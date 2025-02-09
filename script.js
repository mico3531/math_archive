document.addEventListener("DOMContentLoaded", async function () {
    const username = "mico3531";
    const repo = "math_archive";
    const folder = "docs";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;

    const listContainer = document.getElementById("pdf-list");
    const pdfList = []; // PDF情報を格納する配列

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`GitHub APIエラー: ${response.status}`);

        const files = await response.json();

        // 確認用のコンソールログ
        console.log("GitHub API レスポンス:", files);

        if (!Array.isArray(files)) throw new Error("レスポンスが想定と異なります");

        const pdfFiles = files.filter(file => file.name && file.name.endsWith(".pdf")); // 修正: `file.name` が `undefined` でないことを確認

        if (pdfFiles.length === 0) {
            listContainer.innerHTML = "<p>公開中のPDFはありません。</p>";
        } else {
            for (const file of pdfFiles) {
                try {
                    const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?path=${folder}/${file.name}&per_page=1`;
                    const commitResponse = await fetch(commitUrl);
                    if (!commitResponse.ok) throw new Error(`コミット情報の取得に失敗: ${commitResponse.status}`);

                    const commits = await commitResponse.json();

                    let commitMessage = "コミット情報なし";
                    let commitDate = "";

                    if (Array.isArray(commits) && commits.length > 0) {
                        commitMessage = commits[0].commit.message.split("\n")[0]; // 1行目のみ取得
                        commitDate = new Date(commits[0].commit.author.date);
                    }

                    pdfList.push({
                        name: file.name,
                        url: `docs/${file.name}`,
                        commitMessage,
                        commitDate
                    });
                } catch (commitError) {
                    console.error(`コミット情報取得エラー (${file.name}):`, commitError);
                }
            }
        }

        console.log("取得したPDFリスト:", pdfList); // 修正: `pdfList` の中身を確認

        // 修正: `pdfList` が `undefined` でないことを確認してから `updateList` を実行
        if (pdfList.length > 0) {
            updateList(pdfList);
        } else {
            console.warn("PDFリストが空です");
        }

        // 修正: `setupUI` が定義されているか確認してから実行
        if (typeof setupUI === "function") {
            setupUI(pdfList);
        } else {
            console.error("setupUI が未定義です。ui.js が正しく読み込まれているか確認してください。");
        }
    } catch (error) {
        console.error("GitHub APIの取得エラー:", error);
        listContainer.innerHTML = "<p>PDFの一覧を取得できませんでした。</p>";
    }
});
