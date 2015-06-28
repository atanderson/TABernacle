$(document).ready(function(){
    var navLinks = $('.nav.navbar-nav li');
    navLinks.on('click', function(){
        navLinks.removeClass('active');
        $(this).addClass('active');
    });
});