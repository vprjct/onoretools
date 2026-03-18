// script.js


function parseInput() {
    const inputText = document.getElementById("inputText").value;
    const outputTextArea = document.getElementById("outputText");
    let output = "";

    const lines = inputText.trim().split("\n");
    let keywords = ["移動", "競売", "偵察", "を登用"];
    let decreaseCounter = 0; // 減算回数のカウンタ
    const ironworks = document.getElementById("time-decrement").checked; // チェックボックスがONかどうか
    if (ironworks)
    {
        keywords.push("購入");
        keywords.push("売却");
    }

    lines.forEach((line, index) => {
        const parts = line.split("\t");
        if (parts.length >= 4) {
            // 解析対象のテキスト（3番目の要素）
            const task = parts[2].trim();
            let time = parts[3].trim(); // 時刻（4番目の要素）

            // 日付と時刻を分割
            let day = time.split("日")[0];  // 日付部分（例：21）
            let timePart = time.split("日")[1].trim();  // 時刻部分（例：16:00）

            // 時刻を「:」で分割
            const timeArray = timePart.split(":");
            let hour = timeArray[0];  // 時間（16）
            let minute = timeArray[1];  // 分（00）

            if (decreaseCounter > 0) {
                const date = new Date(2025, 0, day, hour, minute); 
                date.setMinutes(date.getMinutes() - 10 * decreaseCounter);

                const newDay = date.getDate();
                const newHour = String(date.getHours()).padStart(2, '0');
                const newMinute = String(date.getMinutes()).padStart(2, '0');
                // 新しい時間をセット
                time = `${newDay}日${newHour}:${newMinute}`;
            }

            // 結果を出力用テキストに追加
            output += `${parts[0]}\t${parts[1]}\t${task}\t${time}\n`; // ID, 日付（無視）, 解析対象のテキスト, 時刻

            // キーワードが見つかった場合、次の行から減算開始
            if (keywords.some(keyword => task.includes(keyword))) {
                decreaseCounter++; // 減算を開始
            }
        }
    });

    // 出力
    outputTextArea.value = output;
}

function adjustFontSize() {
    const fontSize = document.getElementById('font-size-range').value;
    document.getElementById('inputText').style.fontSize = fontSize + 'px';
    document.getElementById('outputText').style.fontSize = fontSize + 'px';
    document.getElementById('font-size-value').textContent = fontSize + 'px';
}