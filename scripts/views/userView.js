/**
 * Created by el on 29.8.2016 г..
 */
class UserView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }
    showLoginPage(isLoggedIn){
        let _that = this;
        let requesTemplate= isLoggedIn ? 'templates/form-user.html':'templates/form-guest.html';
        $.get(requesTemplate,function (template) {
            let renderedTemplate = Mustache.render(template,null);
            $(_that._wrapperSelector).html(renderedTemplate);

            $.get('templates/login.html',function (template) {
                let renderedLogin = Mustache.render(template,null);
                $(_that._mainContentSelector).html(renderedLogin);

                $('#login-request-button').on('click',function (ev) {
                    let username = $('#username').val();
                    let password = $('#password').val();
                    let data = {
                        username: username,
                        password: password
                    };
                    triggerEvent('login',data)
                })
            })
            
        })
    }
    showRegisterPage(isLoggedIn){
        let _that = this;
        let requesTemplate= isLoggedIn ? 'templates/form-guest.html':'templates/form-user.html';
        $.get(requesTemplate,function (template) {
            let renderedTemplate = Mustache.render(template,null);
            $(_that._wrapperSelector).html(renderedTemplate);

            $.get('templates/register.html',function (template) {
                let renderedLogin = Mustache.render(template,null);
                $(_that._mainContentSelector).html(renderedLogin);

                $('#register-request-button').on('click',function (ev) {
                    let username = $('#username').val();
                    let fullname = $('#full-name').val();
                    let password = $('#password').val();
                    let passConfirm = $('#pass-confirm').val();
                    let data = {
                        username: username,
                        fullname:fullname,
                        password: password,
                        passConfirm : passConfirm
                    };
                    triggerEvent('register',data)
                })
            })

        })

    }
    logout (){
        
    }
}
