$(document).ready(function() {
  // SimpleMDEを初期化
  var simplemde = new SimpleMDE({ element: document.querySelector('#markdownEditor') });

  // タイトル入力でEnterキーが押されたときにフォームを送信
  $('#title').keydown(function(e) {
      if (e.key === 'Enter') {
          e.preventDefault(); // フォームの自動送信を防止
          $(this).closest('form').submit(); // 手動でフォームを送信
      }
  });

  // フォーム送信時の処理
  $('form').on('submit', function() {
      // SimpleMDEエディタの現在の値を取得して、<textarea>に設定
      $('#markdownEditor').val(simplemde.value());
  });

  // テキストエリアの高さ自動調整
  $('textarea').on('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
  });
});
