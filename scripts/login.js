var onLoginClick = function(){
    loginUser();
}
var loginUser = function(){
    let user = {}
    user.username = $('#login_username_txb').val();
    user.password = $('#login_pass_txb').val();
    const response = window.api.sendSync("login-event", user);
    console.log(response);
}