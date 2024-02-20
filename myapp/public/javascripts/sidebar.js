$(document).ready(function() {
    $('.hamburger-btn').on('click', function() {
        // サイドバーが表示されているかチェック
        if ($('body').hasClass('mode-active')) {
            // モードコンテンツを非表示にする
            $('body').removeClass('mode-active');
        }
        // サイドバーの表示をトグルする
        $('body').toggleClass('sidebar-active');
    });

    $('.mode-btn').on('click', function() {
        // サイドバーが表示されているかチェック
        if ($('body').hasClass('sidebar-active')) {
            // サイドバーを非表示にする
            $('body').removeClass('sidebar-active');
        }
        // モードコンテンツの表示をトグルする
        $('body').toggleClass('mode-active');
    });
});
