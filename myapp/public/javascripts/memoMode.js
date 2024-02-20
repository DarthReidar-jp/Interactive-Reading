document.addEventListener('DOMContentLoaded', function() {
    // メモ送信ボタンのイベントリスナー
    document.getElementById('submitMemo').addEventListener('click', function() {
      const title = document.getElementById('memoTitle').value;
      const content = document.getElementById('memoContent').value;
  
      // Ajaxリクエストを送信
      $.ajax({
        url: '/reader/createMemo', // 送信先のURL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ title: title, content: content }),
        success: function(response) {
          // メモの送信に成功したときの処理
          console.log("メモが保存されました。", response);
        },
        error: function(xhr, status, error) {
          // エラー処理
          console.error("メモの保存に失敗しました。", error);
        }
      });
    });
  });
  