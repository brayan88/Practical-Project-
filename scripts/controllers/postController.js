class PostController {
    constructor(postView, requester, baseUrl, appKey) {
        this._postView = postView;
        this._requester = requester;
        this._appKey = appKey;
        this._baseServiceUrl = baseUrl +"/appdata/"+appKey+"/posts";
    }
    showCreatePostPage(data,isLoggedIn){
        this._postView.showCreatePostPage(data,isLoggedIn);
    }
    createPost(requestData){
        if(requestData.title.length<10) {
            showPopup('error', "Post title must contains atleast 10 symbols")
        }
        if(requestData.content.length<30) {
            showPopup('error', "Post content must contains atleast 30 symbols")
        }
        let requestUrl = this._baseServiceUrl;

        this._requester.post(requestUrl,requestData,
            function success(data) {
            showPopup('success',"You have successfully created a new post.");
            redirectUrl("#/");
        },
            function error(data) {
                showPopup('error',"An error was occurred while attempting to create a new post");
        });

    }

}
