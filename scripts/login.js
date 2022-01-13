const ipcRenderer = window.require('electron');

var onLoginClick = function(){
    loginUser();
}
var loginUser = function(){
    let user = {}
    user.username = $('#login_username_txb').val();
    user.passwordHash = $('#login_pass_txb').val();

    const response = ipcRenderer.sendSync('login-event', user);
    console.log(response);
}