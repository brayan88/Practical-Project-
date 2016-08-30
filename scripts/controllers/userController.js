class UserController {
    constructor(userView, requester, baseUrl, appKey) {
        this._userView = userView;
        this._requester = requester;
        this._appKey = appKey;
        this._baseServiceUrl = baseUrl+"/user/"+ appKey+"/";
    }
    showLoginPage(isLoggedIn){
        this._userView.showLoginPage(isLoggedIn);
    }
    showRegisterPage(isLoggedIn){
        this._userView.showRegisterPage(isLoggedIn);
    }
    register(data){
        if (data.username.length<5){
            showPopup('error',"Username must consist of atleast 5 symbols !");
            return;
        }
        if(data.fullname.length<5){
            showPopup('error',"Full name must consist of atleast 8 symbols !");
            return;
        }
        if(data.password.length<6){
            showPopup('error',"Password must consist of atleast 6 symbols !");
            return;
        }
        if(data.password!= data.passConfirm){
            showPopup('error',"Passwords do not match");
            return;
        }
        delete data['passConfirm'];

        this._requester.post(this._baseServiceUrl,data,function success(data) {
            showPopup('success',"You have successfully registered.");
            redirectUrl("#/login")
        },function errorCallback(data) {
            showPopup('error',"Registration Failed !")
        });
    }
    login(data){
        let requestUrl = this._baseServiceUrl+"login";
        this._requester.post(requestUrl,data,
            function success(response) {
                sessionStorage.setItem('username',response.username);
                sessionStorage.setItem('_authToken',response._kmd.authtoken);
                sessionStorage.setItem('fullname',response.fullname);

                showPopup('success',"You have successfully logged in");
                redirectUrl('#/')
        },function error(response) {
            showPopup('error',"Login failed !")
        });

    }
    logout(){
        sessionStorage.clear();
        redirectUrl("#/")
    }
    
}