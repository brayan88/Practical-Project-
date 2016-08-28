/**
 * Created by el on 7.8.2016 г..
 */
const kinveyBaseUrl="https://baas.kinvey.com/";
const kinveyAppKey="kid_SJpRupNY";
const kinveyAppSecret="d9b79f9422fc4ebe9fa00162c11f4a37";


function showView(viewName) {
    $('main > section').hide()
    $('#'+viewName).show()
    
}
function showHideMenuLinks() {
    $('#linkHome').show();
    if(sessionStorage.getItem('authToken')==null){
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListBooks').hide();
        $('#linkCreateBooks').hide();
        $('#linkLogout').hide();
    }
    else{
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkListBooks').show();
        $('#linkCreateBooks').show();
        $('#linkLogout').show();
    }
}
function showInfo(message) {
    $('#infoBox').text(message)
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000)
}
    function showError(errorMsg) {
        $('#errorBox').text("Error: "+errorMsg)
        $('#errorBox').show();

}
$(function () {
    showHideMenuLinks();
    showView('viewHome');
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListBooks').click(showListedBooksView);
    $('#linkCreateBooks').click(showCreateBookView);
    $('#linkLogout').click(logout);
    
    $('#formLogin').submit(function (e) {e.preventDefault(); login();});
    $('#formRegister').submit(function (e) { e.preventDefault(); register();});
    $('#formCreateNewBook').submit(function (e) { e.preventDefault(); createNewBook();});

    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });
});

function showHomeView() {
    showView('viewHome')
}
function showLoginView() {
    showView('viewLogin')

}
function showRegisterView() {
    showView('viewRegister')
}
function showListedBooksView() {
    $('#books').empty();
    showView('viewBooks');
    const kinveyBooksUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books";
    const kinveyAuthHeaders ={"Authorization": "Kinvey "+ sessionStorage.getItem('authToken')};
    $.ajax({
        method: "GET",
        url: kinveyBooksUrl,
        headers: kinveyAuthHeaders,
        success: loadBooksSuccess,
        error: handleAjaxError
    });
    function loadBooksSuccess(books) {
        showInfo('Books loaded.')
        if (books.length == 0) {
            $('#books').text('No books in the library.')
        }
        else {
            let booksTable = $('<table>')
                .append($('<tr>')
                    .append('<th>Title</th>', '<th>Author</th>', '<th>Description</th>'));

            for (let book of books) {
                booksTable.append($('<tr>').append(
                    $('<td>').text(book.Title),
                    $('<td>').text(book.Author),
                    $('<td>').text(book.Description)))
            }
            $('#books').append(booksTable);
        }
    }
}
function showCreateBookView() {
    showView('viewCreateBooks')
}
function logout() {
    sessionStorage.clear();
    showHideMenuLinks();
    showHomeView();
    showInfo('Successfully logged out');
}

function login() {
    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/login";
    const kinveyAuthHeaders ={"Authorization": "Basic "+ btoa(kinveyAppKey + ":" + kinveyAppSecret)};
    let userData = {
        username: $('#loginUser').val(),
        password: $('#loginPass').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyLoginUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: loginSuccess,
        error: handleAjaxError
    });
    function loginSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHideMenuLinks();
        showListedBooksView();
        showInfo('Login successful');
    }
}
function handleAjaxError(response) {
    // let errorMsg ="Error "+JSON.stringify(response)
    // $('#errorBox').text(errorMsg).show();
    let errorMsg = JSON.stringify(response);
    if(response.readyState===0) {
        errorMsg = "Cannot connect due to a network error."
    }
    if(response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }
    showError(errorMsg)
}
function register() {
    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";
    const kinveyAuthHeaders ={"Authorization": "Basic "+ btoa(kinveyAppKey + ":" + kinveyAppSecret)};
    let userData = {
        username: $('#registerUser').val(),
        password: $('#registerPass').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyLoginUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError
    });
    function registerSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        showHideMenuLinks();
        showListedBooksView();
        showInfo('Register successful');
    }
}
function createNewBook() {
    const kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books";
    const kinveyAuthHeaders ={"Authorization": "Kinvey "+ sessionStorage.getItem('authToken')};
    let bookData ={
        Title:$('#bookTitle').val(),
        Author:$('#bookAuthor').val(),
        Description:$('#bookDescription').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBookUrl,
        headers: kinveyAuthHeaders,
        data: bookData,
        success: CreateBookSuccess,
        error: handleAjaxError
    });
    function CreateBookSuccess() {
        showListedBooksView();
        showInfo('Book Created.')
    }
}
