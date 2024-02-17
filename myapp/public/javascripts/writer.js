$(document).ready(function() {
  // テキストエリアの高さ自動調整の処理はそのまま保持
  $('textarea').on('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
  });

  // タイトル入力欄に何か入力されたときコンテンツ入力欄を表示
  $('input.title').on('input', function() {
      $('textarea.content').parent().removeClass('d-none');
  });

  // タイトル入力欄でエンターキーが押されたときの処理を修正
  $('input.title').on('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault(); // フォームの送信を防ぐ
          var title = $(this).val(); // タイトル入力欄の値を取得

          // サーバーに非同期リクエストを送信してBookを保存
          $.ajax({
              url: '/writer', // POSTリクエストを受け取るサーバーのエンドポイント
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ title: title, content: "" }), // コンテンツは初期段階では空
              success: function(response) {
                  // 保存に成功したら、返されたBookのIDを用いてリダイレクト
                  window.location.href = `/writer/${response.bookId}`;
              },
              error: function(xhr, status, error) {
                  // エラー処理
                  console.error("保存に失敗しました。", error);
              }
          });
      }
  });
});
