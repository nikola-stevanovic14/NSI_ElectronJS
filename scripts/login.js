const onLoginClick = function(){
    loginUser();
}
const loginUser = function(){
    let user = {}
    user.username = $('#login_username_txb').val();
    user.password = $('#login_pass_txb').val();
    const response = window.api.sendSync("login-event", user);
    if(!response){
        $('.wrong').css('display', 'block')
    }
}

const hideWrongMsg = function(){
    $('.wrong').css('display', 'none')
}