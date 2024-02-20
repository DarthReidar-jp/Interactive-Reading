$(document).ready(function() {
  var simplemde;

  // SimpleMDEの初期化（編集モード用）
  if ($('#markdownEditor').length > 0) {
      simplemde = new SimpleMDE({
          element: document.querySelector('#markdownEditor'),
          spellChecker: false
      });

      // 編集モード時のフォーム送信処理
      $('form').on('submit', function() {
          $('#markdownEditor').val(simplemde.value());
      });
  }

    // タイトル入力時の処理
    $('#title').keydown(function(e) {
      if (e.key === 'Enter') {
          e.preventDefault();
          var title = $(this).val();
          $.ajax({
              type: 'POST',
              url: '/writer',
              data: { title: title },
              success: function(response) {
                  // 生成されたBookのIDを用いてリダイレクト
                  window.location.href = `/writer/${response.bookId}`;
              },
              error: function() {
                  alert('エラーが発生しました。');
              }
          });
      }
    });

  
    // テキストエリアの高さ自動調整
    $('textarea').on('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  });
  