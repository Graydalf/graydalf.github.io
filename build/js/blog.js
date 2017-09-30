(function () {

  var tmpDOM, i, usr, init, buildTree;
  var LOCALSTORAGE_USR_KEY = 'usr';

  /**
   * usr
   */
  usr = localStorage.getItem(LOCALSTORAGE_USR_KEY);

  if (!usr) {
    window.location.href = './login.html'
  }

  usr = JSON.parse(usr);

  $.ajax({
    url: '/api/notes/getTree',
    data: {
      usr: usr.name,
      token: usr.token
    },
    success: function (res) {
      console.log(res);
      if (res.code === 0) {
        init(res.data);
      } else {
        window.location.href = './login.html'
      }
    },
    dataType: 'json'
  });

  document.querySelector('#usr').innerHTML = usr.name;

  document.querySelector('#out').addEventListener('click', function () {
    localStorage.removeItem(LOCALSTORAGE_USR_KEY);
    window.location.href = './login.html'
  });

  /**
   * 
   */
  document.querySelector('#update').addEventListener('click', function () {
    $.ajax({
      url: '/api/notes/update',
      data: {
        usr: usr.name
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);
        if (res.code === 0) {
          //
        } else {
          var gitpath = prompt("git registory:", res.msg);
          $.ajax({
            url: '/api/notes/update',
            data: {
              usr: usr.name,
              gitpath: gitpath
            },
            dataType: 'json',
            success: function (res) {
              console.log(res);
              if (res.code === 0) {
                //
              }
            }
          });
        }
      }
    });
  });

  init = function (data) {

    $('.doc-tree').html('');
    $('.doc-tree').append($("<h2>Document tree</h2>"));
    buildTree(data, $('.doc-tree'));

    /**
     * aside doc-tree hide or show
     */
    document.querySelector('main>aside>.doc-tree-taggle').addEventListener('click', function () {
      var asideDOM = document.querySelector('main>aside');
      if (asideDOM.className.includes('drawer')) {
        asideDOM.className = asideDOM.className.replace(/drawer/, '').trim();
      } else {
        asideDOM.className += ' drawer';
      }
    });

    /**
     * aside doc-tree click event
     */
    tmpDOM = document.querySelectorAll('main>aside>.doc-tree span');
    for (i = 0; i < tmpDOM.length; i++) {
      tmpDOM[i].addEventListener('click', function (item) {
        var ulDOM = item.target.nextSibling;
        if (ulDOM.hasAttribute('hidden')) {
          ulDOM.removeAttribute('hidden');
        } else {
          ulDOM.setAttribute('hidden', 'hidden');
        }
      });
    }
  };

  buildTree = function (tree, $doc) {

    let $ul = $("<ul></ul>");

    $doc.append($ul);

    for (let key in tree.node) {
      let node = tree.node[key];
      let $li = $("<li></li>");
      $ul.append($li);
      if (node.type == 'dir') {
        let $leaf = $(`<span>${node.name}</span>`);
        $li.append($leaf);
        buildTree(node, $li);
      } else if (node.type == 'file') {
        let path = node.node.replace(/\\/g, '\\\\');
        let $leaf = $(`<a href="#" onclick="load('${path}')"> ${node.name}</a>`);
        $li.append($leaf);
      }
    }
  }
}());

function load(arg) {
  $.ajax({
    url: "/api/notes/note",
    dataType: 'html',
    data: {
      path: arg
    },
    success: function (result) {
      $('main>article>section').html(result);
    },
    error: function (err) {
      console.log(JSON.stringify(err));
    }
  });
}