(function () {

  var LOCALSTORAGE_USR_KEY = 'usr';

  /**
   * aside doc-tree hide or show
   */
  document.querySelector('main>article>input:nth-child(3)').addEventListener('click', function () {
    var usr = document.querySelector('main>article>input:nth-child(1)').value;
    var pwd = document.querySelector('main>article>input:nth-child(2)').value;

    console.log(usr+', '+pwd);
    if (usr && pwd) {
      $.ajax({
        url: '/api/users/login',
        data: {
          usr: usr,
          pwd: pwd
        },
        success: function (res) {
          console.log(res);
          if (res.code === 0) {
            localStorage.setItem(LOCALSTORAGE_USR_KEY, JSON.stringify({
              name: usr,
              token: res.data.token
            }));
            window.location.href = './blog.html';
          } else {
            localStorage.removeItem(LOCALSTORAGE_USR_KEY);
            alert(res.msg);
          }
        },
        dataType: 'json'
      });
    }
  })

}())