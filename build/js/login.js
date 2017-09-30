(function() {

  var get

  get = function(url, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlhttp = new XMLHttpRequest()
    } else {
      // IE6, IE5 浏览器执行代码
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(null, xmlhttp.responseText)
      } else {
        callback('err', null)
      }
    }
    xmlhttp.open('GET', url, true)
    xmlhttp.send()
  }

  /**
   * aside doc-tree hide or show
   */
  document.querySelector('main>article>input:nth-child(3)').addEventListener('click', function() {
    var usr = document.querySelector('main>article>input:nth-child(1)').nodeValue;
    var pwd = document.querySelector('main>article>input:nth-child(2)').nodeValue;
    if (usr && pwd) {
      get(`http://www.graydalf.com/githubio/login/?usr=${usr}&pwd=${pwd}`, function(err, data) {
        if (err) {
          localStorage.removeItem('note-usr')
          window.location.href = '../login.html'
          alert('login err')
          return
        }

        //TODO data
        console.log(data)
        localStorage.setItem('note-usr', data)
      })
    }
  })

}())