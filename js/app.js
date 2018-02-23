// подключаемся к firebase для регистрации

$(function () {
    const errors = $("#errors");
    const failed = {fail: false, errors: []};
    const userName = $(".user-name");
    //var isLoggedIn;

    // создаем сессию если пользователь уже логинился
    initSession();

    // обработка формы регистрации
    handleFormRegistration();

    // обработка формы входа
    handleFormLogin();

    // выйти
    logOut();

    /*function isAlreadyLogged() {
        if (!isLoggedIn){
            $('ul.autorization').toggleClass("display_none");
            $('div.welcome').toggleClass("display_none");
        }
    }*/

    // удаленике ошибок после редактировании формы
    function changeForm(form) {
        form.change(function () {
            errors.text("");
            failed.fail = false;
            failed.errors = [];
        });
    }

    // инициализация сессии
    function initSession() {
        //isLoggedIn = true;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                userName.text("Welcome, " + user.displayName + "!");
                $('ul.autorization').css("display", "none");
                $('div.welcome').css("display", "block");
                $('div.controls').removeClass("display_none");
                $('.sidebar #burger').css("display", "block");

                //console.log('lalala');
            }

        });
    }

    function createUser(email, password, name) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log(user);
                user
                    .updateProfile({
                        displayName: name
                    })
                    .then(function () {
                        initSession()
                    });
            })
            .catch(function (err) {
                // обрабатываем ошибки
                // выведу над формой
                errors.text(err.message);
            });
    }

    function handleFormRegistration() {
        const form = $('form[name=register]');

        changeForm(form);

        $('#register').click(function (event) {
            event.preventDefault();

            //const {elements} = event.target;

            const name = $('#register_login').val(); // Имя пользователя
            const email = $('#register_email').val(); // email
            const password = $('#register_password').val(); // password
            const repeatPassword = $('#register_confirmation').val(); // repeat password

            // делаем валидацию формы, савниваем пароли если нужно ...

            // примитивная валидация
            if (password !== repeatPassword) {
                failed.fail = true;
                failed.errors.push("Пароли не совпадают!");
            }

            if (name.length === 0) {
                failed.fail = true;
                failed.errors.push("Введите имя");
            }

            // подключаемся к firebase если пароли совпали и поле имя не пустое
            if (!failed.fail) {
                // сохраняем юзера
                createUser(email, password, name);

                $('#register_login').value = "";
                $('#register_email').value = "";
                $('#register_password').value = "";
                $('#register_confirmation').value = "";
            } else {
                // если есть ошибки, выводим на экран
                let stringErrors = "";
                for (let error of failed.errors) {
                    stringErrors += error + "<br>";
                }
                errors.text(stringErrors);
            }
        });
    }

    // форма аутентификации
    function handleFormLogin() {
        const form = $('form[name=auth]');
        changeForm(form);
        // делаешь какую нибудь проверку пароля и почты, потом авторизируешь
        $('#auth').click(function (event) {
            event.preventDefault();
            const email = $('#auth_login').val(); // первый input в форме
            const password = $('#auth_password').val(); // второй input в форме

            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    // наши действия
                    initSession();
                    $('#auth_login').value = '';
                    $('#auth_password').value = '';
                })
                .catch(function (err) {
                    // обработка ошибок
                    errors.text(err.message);
                    console.log(err);
                });
        });
    }

    // выход
    function logOut() {
        //isLoggedIn = false;
        const btnLogout = $('#btnLogout');
        btnLogout.click(function () {
            firebase
                .auth()
                .signOut().then(function () {
                $('div.welcome').css("display", "none");
                $('ul.autorization').css("display", "block");
                $('div.controls').css("display", "none");
                $('.sidebar #burger').css("display", "none");

            })
                .catch(function (err) {
                    console.log(err);
                });
        });
    }

    /*******************toggle sidebar************************/
    $("button#burger").click(function () {
        //$('div.controls').css("display", "");
        $("ul.side-menu, div.controls").toggleClass("display_none");
        $("#sidebar").toggleClass("col-sm-1 col-sm-3");
        $(".content").toggleClass("col-sm-11 col-sm-9");
    });

    /*******************changing font-size********************/
    $("input#font_size").change(function () {
        var value = $(this).val();
        if ((value < 8 || value > 24) || (value % 1 !== 0)) alert('must be integer value within 8..24');
        else $(".content p").css("font-size", value + "px");
    });

    /***************changing content background***************/
    $('input[type=radio][name=optionsRadios]').change(function () {
        switch (this.value) {
            case 'option1':
                $(".content").css("background", "#d2d6a8");
                break;

            case 'option2':
                $(".content").css("background", "#eee");
                break;

            case 'option3':
                $(".content").css("background", "#fff");
                break;

            case 'option4':
                $(".content").css("background", "#aaa");
                break;
        }

    });

    /*$('input[type=radio][name=optionsRadios]').change(function () {
        if (this.value === 'option1') {
            $(".content").css("background", "#d2d6a8");
        }
        else if (this.value === 'option2') {
            $(".content").css("background", "#eee");
        }
        else if (this.value === 'option3') {
            $(".content").css("background", "#fff");
        }
        else if (this.value === 'option4') {
            $(".content").css("background", "#aaa");
        }
    });*/

    /*******************changing font-family******************/
    $("select#font_family").change(function () {
        $(".content p").css("font-family", $(this).val());
    });

    /****************deleting last paragraph******************/
    $("#delete").click(function () {
        var par = $(".content p");
        var length = par.length;

        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function () {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }
        par[length - 1].remove();
    });


});

var user2 = {
    name: 2225552,
    id: new Date(),
    email: 'simple@gmail.com'
}

/*localStorage.setItem('User', JSON.stringify(user2));

console.log('User', localStorage.getItem('User'));
console.log('UserObj', JSON.parse(localStorage.getItem('User')));*/

